import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { Comment, ContactMessage, Subscriber, DashboardStats } from './types';

// ==================== COMMENTS ====================

export async function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const data: any = {
      slug: comment.slug,
      author: comment.author,
      email: comment.email,
      content: comment.content,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    // Only include parentId if it's defined
    if (comment.parentId) {
      data.parentId = comment.parentId;
    }
    
    const docRef = await addDoc(collection(db, 'comments'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function getCommentsBySlug(slug: string): Promise<Comment[]> {
  try {
    const q = query(
      collection(db, 'comments'),
      where('slug', '==', slug),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString() || new Date().toISOString(),
    })) as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function getAllComments(): Promise<Comment[]> {
  try {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString() || new Date().toISOString(),
    })) as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function updateComment(id: string, updates: Partial<Comment>) {
  try {
    const docRef = doc(db, 'comments', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

export async function deleteComment(id: string) {
  try {
    await deleteDoc(doc(db, 'comments', id));
    // Also delete replies to this comment
    const q = query(collection(db, 'comments'), where('parentId', '==', id));
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

// ==================== CONTACT MESSAGES ====================

export async function addContactMessage(
  message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>
) {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...message,
      createdAt: Timestamp.now(),
      read: false,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    })) as ContactMessage[];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function markMessageAsRead(id: string) {
  try {
    const docRef = doc(db, 'messages', id);
    await updateDoc(docRef, { read: true });
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await deleteDoc(doc(db, 'messages', id));
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

// ==================== SUBSCRIBERS ====================

export async function addSubscriber(email: string) {
  try {
    // Check if already subscribed
    const q = query(collection(db, 'subscribers'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty && !querySnapshot.docs[0].data().unsubscribed) {
      throw new Error('Already subscribed');
    }

    // If resubscribing, update the document
    if (!querySnapshot.empty) {
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, 'subscribers', docId), {
        unsubscribed: false,
        subscribedAt: Timestamp.now(),
      });
      return docId;
    }

    // Add new subscriber
    const docRef = await addDoc(collection(db, 'subscribers'), {
      email,
      subscribedAt: Timestamp.now(),
      unsubscribed: false,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
}

export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const q = query(collection(db, 'subscribers'), where('unsubscribed', '==', false));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      subscribedAt: doc.data().subscribedAt?.toDate().toISOString() || new Date().toISOString(),
    })) as Subscriber[];
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
}

export async function unsubscribe(id: string) {
  try {
    const docRef = doc(db, 'subscribers', id);
    await updateDoc(docRef, { unsubscribed: true });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    throw error;
  }
}

export async function unsubscribeByEmail(email: string) {
  try {
    const q = query(collection(db, 'subscribers'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      await updateDoc(querySnapshot.docs[0].ref, { unsubscribed: true });
    }
  } catch (error) {
    console.error('Error unsubscribing:', error);
    throw error;
  }
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get comment count
    const commentsSnapshot = await getDocs(collection(db, 'comments'));
    const totalComments = commentsSnapshot.size;

    // Get recent comments
    const recentCommentsQuery = query(
      collection(db, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const recentCommentsSnapshot = await getDocs(recentCommentsQuery);
    const recentComments = recentCommentsSnapshot.docs.slice(0, 5).map((doc) => ({
      id: doc.id,
      author: doc.data().author,
      slug: doc.data().slug,
      date: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }));

    // Get message count
    const messagesSnapshot = await getDocs(collection(db, 'messages'));
    const totalMessages = messagesSnapshot.size;

    // Get recent messages
    const recentMessagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );
    const recentMessagesSnapshot = await getDocs(recentMessagesQuery);
    const recentMessages = recentMessagesSnapshot.docs.slice(0, 5).map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      date: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    }));

    // Get subscriber count
    const subscribersSnapshot = await getDocs(
      query(collection(db, 'subscribers'), where('unsubscribed', '==', false))
    );
    const totalSubscribers = subscribersSnapshot.size;

    return {
      totalComments,
      totalMessages,
      totalSubscribers,
      totalPosts: 0, // Will be calculated from GitHub
      recentComments,
      recentMessages,
      recentPosts: [],
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalComments: 0,
      totalMessages: 0,
      totalSubscribers: 0,
      totalPosts: 0,
      recentComments: [],
      recentMessages: [],
      recentPosts: [],
    };
  }
}
