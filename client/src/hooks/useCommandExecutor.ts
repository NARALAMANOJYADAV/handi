import { useCallback } from 'react';
import type { ParsedCommand, CommandFeedback, SupportedLanguage, CustomCommand } from '../types';
import { parseCommand, getWebsiteUrl, getScrollAmount, buildSearchUrl } from '../services/commandParser';
import { speechService } from '../services/speechService';
import { commandApi } from '../services/api';

interface UseCommandExecutorReturn {
  executeCommand: (text: string, customCommands?: CustomCommand[]) => Promise<CommandFeedback>;
}

export function useCommandExecutor(
  language: SupportedLanguage,
  voiceFeedback: boolean = true,
  speechRate: number = 1,
  onAccessibilityToggle?: (setting: 'darkMode' | 'highContrast' | 'largeText' | 'focusMode') => void
): UseCommandExecutorReturn {
  const speak = useCallback(
    async (text: string) => {
      if (voiceFeedback) {
        try {
          await speechService.speak(text, language, speechRate);
        } catch {
          // Ignore speech errors
        }
      }
    },
    [voiceFeedback, language, speechRate]
  );

  const createFeedback = (
    detectedCommand: string,
    actionPerformed: string,
    voiceResponse: string,
    status: 'success' | 'error' | 'info' = 'success'
  ): CommandFeedback => ({
    id: Date.now().toString(),
    detectedCommand,
    actionPerformed,
    voiceResponse,
    status,
    timestamp: new Date(),
  });

  const executeCommand = useCallback(
    async (text: string, customCommands: CustomCommand[] = []): Promise<CommandFeedback> => {
      // First, check custom commands
      const customMatch = customCommands.find(
        (cmd) => text.toLowerCase().includes(cmd.trigger.toLowerCase())
      );

      if (customMatch) {
        // Execute custom command actions
        for (const action of customMatch.actions) {
          if (action.type === 'open_url' && action.target) {
            window.open(action.target, '_blank');
            if (action.delay) await new Promise((r) => setTimeout(r, action.delay));
          }
        }
        const feedback = createFeedback(
          text,
          `Executed custom command: ${customMatch.description}`,
          `Running your custom command: ${customMatch.description}`,
          'success'
        );
        await speak(feedback.voiceResponse);
        return feedback;
      }

      // Parse the command
      const parsed: ParsedCommand = parseCommand(text, language);

      let feedback: CommandFeedback;

      switch (parsed.intent) {
        case 'open_website': {
          const url = getWebsiteUrl(parsed.target || '');
          if (url) {
            window.open(url, '_blank');
            feedback = createFeedback(text, `Opening ${parsed.target}`, `Opening ${parsed.target}`);
          } else {
            // Try as a search query
            const searchUrl = buildSearchUrl(parsed.target || '');
            window.open(searchUrl, '_blank');
            feedback = createFeedback(
              text,
              `Searching for ${parsed.target}`,
              `I couldn't find that website, so I'm searching for ${parsed.target}`
            );
          }
          break;
        }

        case 'search': {
          const searchUrl = buildSearchUrl(parsed.value || text);
          window.open(searchUrl, '_blank');
          feedback = createFeedback(text, `Searching for: ${parsed.value}`, `Searching for ${parsed.value}`);
          break;
        }

        case 'scroll': {
          const amount = getScrollAmount(parsed.value);
          const direction = parsed.target === 'up' ? -1 : 1;
          window.scrollBy({ top: amount * direction, behavior: 'smooth' });
          feedback = createFeedback(text, `Scrolling ${parsed.target}`, `Scrolling ${parsed.target}`);
          break;
        }

        case 'click': {
          const target = parsed.target?.toLowerCase() || '';
          // Try to find and click the element
          const elements = document.querySelectorAll(
            'button, a, [role="button"], input[type="submit"], [onclick]'
          );
          let clicked = false;

          elements.forEach((el) => {
            const elText = (el as HTMLElement).innerText?.toLowerCase() || '';
            const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
            if (elText.includes(target) || ariaLabel.includes(target)) {
              (el as HTMLElement).click();
              clicked = true;
            }
          });

          if (clicked) {
            feedback = createFeedback(text, `Clicked: ${parsed.target}`, `Clicking ${parsed.target}`);
          } else {
            feedback = createFeedback(
              text,
              `Could not find: ${parsed.target}`,
              `Sorry, I couldn't find the element ${parsed.target}`,
              'error'
            );
          }
          break;
        }

        case 'navigate_back':
          window.history.back();
          feedback = createFeedback(text, 'Navigating back', 'Going back to the previous page');
          break;

        case 'navigate_forward':
          window.history.forward();
          feedback = createFeedback(text, 'Navigating forward', 'Going forward');
          break;

        case 'refresh':
          feedback = createFeedback(text, 'Refreshing page', 'Refreshing the page');
          await speak(feedback.voiceResponse);
          window.location.reload();
          return feedback;

        case 'new_tab':
          window.open('about:blank', '_blank');
          feedback = createFeedback(text, 'Opening new tab', 'Opening a new tab');
          break;

        case 'read_page': {
          const content = document.body.innerText?.slice(0, 2000) || 'No content to read';
          feedback = createFeedback(text, 'Reading page content', 'Reading the page content for you');
          await speak(feedback.voiceResponse);
          await speak(content);
          return feedback;
        }

        case 'stop_reading':
          speechService.stop();
          feedback = createFeedback(text, 'Stopped reading', 'I stopped reading');
          break;

        case 'type_text': {
          const activeElement = document.activeElement as HTMLInputElement;
          if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            activeElement.value += parsed.value || '';
            activeElement.dispatchEvent(new Event('input', { bubbles: true }));
            feedback = createFeedback(text, `Typed: ${parsed.value}`, `Typed: ${parsed.value}`);
          } else {
            feedback = createFeedback(
              text,
              'No input field focused',
              'Please click on an input field first, then ask me to type',
              'error'
            );
          }
          break;
        }

        case 'play_video': {
          const videos = document.querySelectorAll('video');
          if (videos.length > 0) {
            videos[0].play();
            feedback = createFeedback(text, 'Playing video', 'Playing the video');
          } else {
            feedback = createFeedback(text, 'No video found', 'No video found on this page', 'error');
          }
          break;
        }

        case 'pause_video': {
          const vids = document.querySelectorAll('video');
          vids.forEach((v) => v.pause());
          feedback = createFeedback(text, 'Paused video', 'Video paused');
          break;
        }

        case 'volume_up': {
          const audios = document.querySelectorAll('video, audio') as NodeListOf<HTMLMediaElement>;
          audios.forEach((a) => (a.volume = Math.min(1, a.volume + 0.2)));
          feedback = createFeedback(text, 'Volume increased', 'Volume increased');
          break;
        }

        case 'volume_down': {
          const audios2 = document.querySelectorAll('video, audio') as NodeListOf<HTMLMediaElement>;
          audios2.forEach((a) => (a.volume = Math.max(0, a.volume - 0.2)));
          feedback = createFeedback(text, 'Volume decreased', 'Volume decreased');
          break;
        }

        case 'emergency':
          feedback = createFeedback(
            text,
            '🚨 EMERGENCY ALERT TRIGGERED',
            'Emergency alert has been triggered. Opening support page.',
            'info'
          );
          await speak(feedback.voiceResponse);
          window.open('https://www.google.com/search?q=emergency+help+near+me', '_blank');
          return feedback;

        case 'dark_mode':
          onAccessibilityToggle?.('darkMode');
          feedback = createFeedback(text, 'Toggled dark mode', 'Dark mode toggled');
          break;

        case 'high_contrast':
          onAccessibilityToggle?.('highContrast');
          feedback = createFeedback(text, 'Toggled high contrast', 'High contrast mode toggled');
          break;

        case 'large_text':
          onAccessibilityToggle?.('largeText');
          feedback = createFeedback(text, 'Toggled large text', 'Large text mode toggled');
          break;

        case 'reader_mode':
          onAccessibilityToggle?.('focusMode');
          feedback = createFeedback(text, 'Toggled reader mode', 'Reader mode toggled');
          break;

        case 'open_menu':
          feedback = createFeedback(text, 'Opening menu', 'Opening the menu');
          break;

        default:
          feedback = createFeedback(
            text,
            `Unknown command: ${text}`,
            `Sorry, I didn't understand that command. Please try again.`,
            'error'
          );
      }

      // Speak the feedback
      await speak(feedback.voiceResponse);

      // Save command to history (fire and forget)
      try {
        commandApi.saveCommand({
          text,
          action: parsed.intent,
          params: { target: parsed.target || '', value: parsed.value || '' },
          timestamp: new Date(),
          language,
          confidence: parsed.confidence,
          status: feedback.status === 'error' ? 'failed' : 'success',
          response: feedback.voiceResponse,
        });
      } catch {
        // Ignore save errors
      }

      return feedback;
    },
    [language, speak, onAccessibilityToggle]
  );

  return { executeCommand };
}
