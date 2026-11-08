import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

type PermissionIssue = { canAskAgain: boolean } | null;

export function usePickProducePhoto(onPicked: (uri: string) => void) {
  const [permissionIssue, setPermissionIssue] = useState<PermissionIssue>(null);
  const [isPicking, setIsPicking] = useState(false);

  const pickPhoto = useCallback(async () => {
    if (isPicking) return;
    setIsPicking(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setPermissionIssue({ canAskAgain: permission.canAskAgain });
        return;
      }
      setPermissionIssue(null);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) onPicked(result.assets[0].uri);
    } finally {
      setIsPicking(false);
    }
  }, [isPicking, onPicked]);

  return { pickPhoto, isPicking, permissionIssue };
}
