import imageCompression from "browser-image-compression"

const DB_NAME = "FinanceXDB"
const STORE_NAME = "photos"
const DB_VERSION = 1
const MAX_SIZE_MB = 0.8 // ✅ 800KB

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const compressImageIfNeeded = async (file) => {
  const sizeMB = file.size / 1024 / 1024

  if (sizeMB <= MAX_SIZE_MB) return file

  const options = {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: 1280,
    initialQuality: 0.7,
    useWebWorker: true,
  }

  try {
    console.log(
      `Compressing ${file.name} (${sizeMB.toFixed(2)}MB)`
    )

    const compressed = await imageCompression(file, options)

    console.log(
      `After compress: ${(compressed.size / 1024 / 1024).toFixed(2)}MB`
    )

    return compressed
  } catch (err) {
    console.error("Compress gagal:", err)
    return file
  }
}

//
// ✅ SAVE PHOTO (FIXED)
// Sekarang menerima File → convert ke base64 → simpan
//
export function savePhoto(file) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file) {
        reject("No file provided")
        return
      }

      // ✅ COMPRESS DI SINI
      const processedFile = await compressImageIfNeeded(file)

      const reader = new FileReader()

      reader.onloadend = async () => {
        try {
          const base64 = reader.result
          const db = await openDB()

          const tx = db.transaction(STORE_NAME, "readwrite")
          const store = tx.objectStore(STORE_NAME)

          const photo = {
            id: Date.now() + Math.random(),
            data: base64,
          }

          store.add(photo)

          tx.oncomplete = () => resolve(photo)
          tx.onerror = () => reject(tx.error)
        } catch (err) {
          reject(err)
        }
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(processedFile)

    } catch (err) {
      reject(err)
    }
  })
}

//
// ✅ GET SINGLE PHOTO
//
export async function getPhoto(id) {
  const db = await openDB()

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const store = tx.objectStore(STORE_NAME)

    const req = store.get(id)

    req.onsuccess = () => resolve(req.result || null)
    req.onerror = () => resolve(null)
  })
}
export const getPhotoById = getPhoto

//
// ✅ GET MULTIPLE PHOTOS
//
export async function getPhotos(ids = []) {
  if (!ids.length) return []

  const db = await openDB()

  return Promise.all(
    ids.map(
      (id) =>
        new Promise((resolve) => {
          const tx = db.transaction(STORE_NAME, "readonly")
          const store = tx.objectStore(STORE_NAME)

          const req = store.get(id)

          req.onsuccess = () => resolve(req.result || null)
          req.onerror = () => resolve(null)
        })
    )
  )
}

//
// ✅ DELETE SINGLE PHOTO
//
export async function deletePhoto(id) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)

    store.delete(id)

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

//
// ✅ DELETE MULTIPLE PHOTOS
//
export async function deletePhotos(ids = []) {
  if (!ids.length) return

  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)

    ids.forEach((id) => store.delete(id))

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

//
// ✅ CLEAR ALL PHOTOS
//
export async function clearAllPhotos() {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)

    store.clear()

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}