import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

const PHOTO_DIRECTORY = 'listing-photos';
const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

function extensionFrom(uri: string) {
  const match = uri.split('?')[0].match(/\.([a-z0-9]{2,5})$/i);
  return match ? match[1].toLowerCase() : 'jpg';
}

// Picker URIs live in a cache the OS may clear, so we copy the photo into
// documents. We store a relative path because the iOS container path changes
// between app updates.
export async function persistListingPhoto(sourceUri: string, listingId: string): Promise<string> {
  if (Platform.OS === 'web') return sourceUri;

  const directory = new Directory(Paths.document, PHOTO_DIRECTORY);
  directory.create({ intermediates: true, idempotent: true });

  const fileName = `${listingId}.${extensionFrom(sourceUri)}`;
  const target = new File(directory, fileName);
  await new File(sourceUri).copy(target, { overwrite: true });

  return `${PHOTO_DIRECTORY}/${fileName}`;
}

export function resolvePhotoUri(storedPath: string): string {
  if (SCHEME_PATTERN.test(storedPath)) return storedPath;
  return new File(Paths.document, storedPath).uri;
}

export function deleteListingPhoto(storedPath: string) {
  if (Platform.OS === 'web' || SCHEME_PATTERN.test(storedPath)) return;
  try {
    const file = new File(Paths.document, storedPath);
    if (file.exists) file.delete();
  } catch {
    // A leftover file is harmless; the listing itself is already gone.
  }
}
