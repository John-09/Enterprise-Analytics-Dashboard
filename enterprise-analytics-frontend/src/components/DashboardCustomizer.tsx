import { useState, useEffect } from "react";
import { Modal, Switch, Button, message, List } from "antd";
import {
  SettingOutlined,
  HolderOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { WIDGET_LABELS } from "@/api/preferences";
import {
  useDashboardPreferences,
  useSavePreferences,
  useResetPreferences,
} from "@/hooks/useDashboardPreferences";
import type { WidgetConfig } from "@/api/preferences";

interface DashboardCustomizerProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardCustomizer({
  open,
  onClose,
}: DashboardCustomizerProps) {
  const { data: preferences, isLoading } = useDashboardPreferences();
  const savePreferences = useSavePreferences();
  const resetPreferences = useResetPreferences();

  const [localWidgets, setLocalWidgets] = useState<WidgetConfig[]>([]);

  // Sync local state when preferences load
  useEffect(() => {
    if (preferences?.widgets) {
      setLocalWidgets([...preferences.widgets].sort((a, b) => a.order - b.order));
    }
  }, [preferences]);

  const handleToggle = (widgetId: string, visible: boolean) => {
    setLocalWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, visible } : w))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setLocalWidgets((prev) => {
      const newList = [...prev];
      [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
      return newList.map((w, i) => ({ ...w, order: i }));
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === localWidgets.length - 1) return;
    setLocalWidgets((prev) => {
      const newList = [...prev];
      [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
      return newList.map((w, i) => ({ ...w, order: i }));
    });
  };

  const handleSave = async () => {
    try {
      await savePreferences.mutateAsync(localWidgets);
      message.success("Dashboard layout saved!");
      onClose();
    } catch {
      message.error("Failed to save preferences");
    }
  };

  const handleReset = async () => {
    try {
      const result = await resetPreferences.mutateAsync();
      setLocalWidgets(result.layout.widgets.sort((a, b) => a.order - b.order));
      message.success("Dashboard reset to default!");
    } catch {
      message.error("Failed to reset preferences");
    }
  };

  return (
    <Modal
      title={
        <span>
          <SettingOutlined className="mr-2" />
          Customize Dashboard
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="reset"
          icon={<ReloadOutlined />}
          onClick={handleReset}
          loading={resetPreferences.isPending}
        >
          Reset to Default
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={savePreferences.isPending}
        >
          Save Changes
        </Button>,
      ]}
      width={480}
    >
      <p className="text-gray-500 mb-4">
        Toggle widgets on/off and reorder them using the arrow buttons.
      </p>

      <List
        loading={isLoading}
        dataSource={localWidgets}
        renderItem={(widget, index) => (
          <List.Item
            key={widget.id}
            className="bg-gray-50 mb-2 rounded px-3"
            actions={[
              <Button
                key="up"
                size="small"
                type="text"
                disabled={index === 0}
                onClick={() => handleMoveUp(index)}
              >
                ↑
              </Button>,
              <Button
                key="down"
                size="small"
                type="text"
                disabled={index === localWidgets.length - 1}
                onClick={() => handleMoveDown(index)}
              >
                ↓
              </Button>,
            ]}
          >
            <div className="flex items-center gap-3">
              <HolderOutlined className="text-gray-400" />
              <Switch
                checked={widget.visible}
                onChange={(checked) => handleToggle(widget.id, checked)}
                size="small"
              />
              <span className={widget.visible ? "" : "text-gray-400"}>
                {WIDGET_LABELS[widget.id] || widget.id}
              </span>
            </div>
          </List.Item>
        )}
      />
    </Modal>
  );
}
