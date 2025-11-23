'use client';

import type { Selection } from '@react-types/shared';

import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { Spinner } from '@heroui/spinner';

// UI-focused style options for dropdown display
// Note: This is separate from lib/infographic-styles.ts which contains
// the detailed style prompts sent to the AI API
const INFOGRAPHIC_STYLES = [
  { key: 'FUN_PLAYFUL', label: 'Fun & Playful' },
  { key: 'CLEAN_MINIMALIST', label: 'Clean Minimalist' },
  { key: 'DARK_MODE_TECH', label: 'Dark Mode Tech' },
  { key: 'MODERN_EDITORIAL', label: 'Modern Editorial' },
] as const;

type InfographicStyle = (typeof INFOGRAPHIC_STYLES)[number]['key'];

interface InfographicSettingsPanelProps {
  url: string;
  style: InfographicStyle;
  language: string;
  isGenerating: boolean;
  isFetchingContent: boolean;
  canGenerate: boolean;
  onUrlChange: (url: string) => void;
  onStyleChange: (style: InfographicStyle) => void;
  onLanguageChange: (language: string) => void;
  onFetchContent: () => void;
  onGenerateInfographic: () => void;
}

export function InfographicSettingsPanel({
  url,
  style,
  language,
  isGenerating,
  isFetchingContent,
  canGenerate,
  onUrlChange,
  onStyleChange,
  onLanguageChange,
  onFetchContent,
  onGenerateInfographic,
}: InfographicSettingsPanelProps) {
  return (
    <>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Input
            aria-label='URL to fetch content from'
            label='URL'
            placeholder='https://example.com/article'
            type='url'
            value={url}
            onChange={e => onUrlChange(e.target.value)}
          />
          <Button
            color='secondary'
            isDisabled={!url || isFetchingContent}
            size='md'
            onPress={onFetchContent}
          >
            {isFetchingContent ? (
              <div className='flex items-center gap-2'>
                <Spinner size='sm' />
                Fetching Content...
              </div>
            ) : (
              'Fetch Content'
            )}
          </Button>
        </div>

        <Select
          className='w-full'
          label='Infographic Style'
          selectedKeys={[style]}
          onSelectionChange={(keys: Selection) => {
            // Handle Selection type properly
            if (keys === 'all') return;
            const key = Array.from(keys)[0];

            if (typeof key === 'string') {
              onStyleChange(key as InfographicStyle);
            }
          }}
        >
          {INFOGRAPHIC_STYLES.map(styleOption => (
            <SelectItem key={styleOption.key}>{styleOption.label}</SelectItem>
          ))}
        </Select>

        <Input
          aria-label='Language for infographic text'
          label='Language'
          placeholder='English'
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
        />
      </div>

      <Button
        color='primary'
        isDisabled={!canGenerate || isGenerating}
        size='lg'
        onPress={onGenerateInfographic}
      >
        {isGenerating ? (
          <div className='flex items-center gap-2'>
            <Spinner size='sm' />
            Generating Infographic...
          </div>
        ) : (
          'Generate Infographic'
        )}
      </Button>
    </>
  );
}
