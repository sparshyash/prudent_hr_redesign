// lib/data-service.js
import { db } from "./firebase";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";

// Get all blogs for the HR Saathi Feed
export async function getAllBlogs() {
  const blogsCol = collection(db, "blogs");
  const q = query(blogsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get a single blog for the dynamic [id] page
export async function getBlogById(id) {
  const docRef = doc(db, "blogs", id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}