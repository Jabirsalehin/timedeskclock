import { memo } from 'react';
import { useProfileStore } from '../../store/profileStore';
import MinimalWidgets from '../profiles/MinimalWidgets';
import StudentWidgets from '../profiles/StudentWidgets';
import DeveloperWidgets from '../profiles/DeveloperWidgets';
import TraderWidgets from '../profiles/TraderWidgets';
import PrayerWidgets from '../profiles/PrayerWidgets';

interface ProfileWidgetsPanelProps {
  /** Compact layout for fullscreen — clock stays dominant */
  compact?: boolean;
}

export const ProfileWidgetsPanel = memo(function ProfileWidgetsPanel({
  compact = false,
}: ProfileWidgetsPanelProps) {
  const { activeProfile } = useProfileStore();

  const content = (() => {
    switch (activeProfile) {
      case 'minimal':
        return <MinimalWidgets />;
      case 'student':
        return <StudentWidgets />;
      case 'developer':
        return <DeveloperWidgets />;
      case 'trader':
        return <TraderWidgets />;
      case 'prayer':
        return <PrayerWidgets />;
      default:
        return <MinimalWidgets />;
    }
  })();

  return (
    <div
      className={
        compact
          ? 'max-w-5xl mx-auto opacity-90 scale-[0.92] origin-top'
          : 'max-w-5xl mx-auto'
      }
    >
      {content}
    </div>
  );
});
