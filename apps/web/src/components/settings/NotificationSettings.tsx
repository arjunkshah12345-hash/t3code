import { settlePromise } from "@t3tools/client-runtime/state/runtime";
import { useState } from "react";

import {
  ALERT_SOUND_LABELS,
  type AlertSound,
  hasDesktopNotifications,
  hasNotificationSound,
  NOTIFICATION_MODE_LABELS,
  previewAlertSound,
  readAlertSound,
  unlockNotificationAudio,
  writeAlertSound,
} from "../../threadNotifications";
import { Button } from "../ui/button";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "../ui/select";
import { SettingsRow } from "./settingsLayout";
import { searchableSetting } from "./settingsSearch";
import { useScopedSettings, useUpdateScopedSettings } from "./useScopedSettings";

export function NotificationSettings() {
  const mode = useScopedSettings((settings) => settings.notificationMode);
  const updateSettings = useUpdateScopedSettings();
  const [permissionMessage, setPermissionMessage] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);

  return (
    <SettingsRow
      {...searchableSetting("thread-notifications")}
      description={
        permissionMessage ??
        "System alerts when a thread finishes, fails, or needs input or approval. Applies to this device while Tung Tung Tung Code is open."
      }
      control={
        <Select
          value={mode}
          disabled={requesting}
          onValueChange={async (value) => {
            if (
              value !== "off" &&
              value !== "notifications" &&
              value !== "sound" &&
              value !== "notifications-and-sound"
            )
              return;
            setPermissionMessage(null);
            if (hasNotificationSound(value)) unlockNotificationAudio();
            if (hasDesktopNotifications(value)) {
              if (typeof Notification === "undefined" || !window.isSecureContext) {
                setPermissionMessage(
                  "Notifications need a supported browser over HTTPS, or the desktop app. Sound only is still available.",
                );
                return;
              }
              setRequesting(true);
              const permission = await settlePromise(() => Notification.requestPermission());
              setRequesting(false);
              if (permission._tag === "Failure") {
                setPermissionMessage(
                  "Notifications are unavailable in this browser. Sound only is still available.",
                );
                return;
              }
              if (permission.value !== "granted") {
                setPermissionMessage(
                  "Allow notifications in your browser or system settings, then choose this option again. Sound only is still available.",
                );
                return;
              }
            }
            updateSettings({ notificationMode: value });
          }}
        >
          <SelectTrigger size="sm" className="w-full sm:w-56" aria-label="Thread notifications">
            <SelectValue>{NOTIFICATION_MODE_LABELS[mode]}</SelectValue>
          </SelectTrigger>
          <SelectPopup align="end" alignItemWithTrigger={false}>
            {Object.entries(NOTIFICATION_MODE_LABELS).map(([value, label]) => (
              <SelectItem key={value} hideIndicator value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      }
    />
  );
}

export function AlertSoundSettings() {
  const mode = useScopedSettings((settings) => settings.notificationMode);
  const [sound, setSound] = useState<AlertSound>(readAlertSound);
  if (!hasNotificationSound(mode)) return null;

  return (
    <SettingsRow
      {...searchableSetting("alert-sound")}
      description={
        sound === "knock"
          ? "One knock when a thread finishes. Tung, tung, TUNG when one needs your input or approval."
          : "The classic chime for finished threads and requests for input."
      }
      control={
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Select
            value={sound}
            onValueChange={(value) => {
              if (value !== "knock" && value !== "chime") return;
              writeAlertSound(value);
              setSound(value);
              previewAlertSound("input");
            }}
          >
            <SelectTrigger size="sm" className="w-full sm:w-40" aria-label="Alert sound">
              <SelectValue>{ALERT_SOUND_LABELS[sound]}</SelectValue>
            </SelectTrigger>
            <SelectPopup align="end" alignItemWithTrigger={false}>
              {Object.entries(ALERT_SOUND_LABELS).map(([value, label]) => (
                <SelectItem key={value} hideIndicator value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
          <Button size="sm" variant="outline" onClick={() => previewAlertSound("input")}>
            Play
          </Button>
        </div>
      }
    />
  );
}
