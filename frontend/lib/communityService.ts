import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter, Timestamp, increment } from 'firebase/firestore';

export interface CommunityUser {
  id?: string;
  email: string;
  username: string;
  profileSlug: string;
  name: string;
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  resume?: string;
  hobbies?: string[];
  profileImage?: string;
  coverImage?: string;
  status: 'active' | 'suspended' | 'deactivated' | 'deleted';
  role: 'member' | 'moderator';
  createdAt: Date;
  lastActive: Date;
  stats: {
    posts: number;
    followers: number;
    following: number;
    profileViews: number;
    postImpressions: number;
  };
}

export interface Post {
  id?: string;
  userId: string;
  username: string;
  userName?: string;
  userHeadline?: string;
  userLocation?: string;
  userSlug?: string;
  userImage?: string;
  content: string;
  mediaUrls?: string[];
  linkUrl?: string;
  linkPreview?: {
    title: string;
    description: string;
    image: string;
  };
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id?: string;
  postId: string;
  userId: string;
  username: string;
  userImage?: string;
  content: string;
  likes: number;
  createdAt: Date;
}

const USERS_COLLECTION = 'communityUsers';
const POSTS_COLLECTION = 'communityPosts';
const COMMENTS_COLLECTION = 'communityComments';
const LIKES_COLLECTION = 'communityLikes';
const FOLLOWS_COLLECTION = 'communityFollows';
const MESSAGES_COLLECTION = 'communityMessages';
const CONVERSATIONS_COLLECTION = 'communityConversations';

export const communityService = {
  // User Management
  async createUser(email: string, name: string, profileImage?: string): Promise<string> {
    const username = email.split('@')[0];
    const profileSlug = `${username}-${Date.now().toString(36)}`;
    const userRef = await addDoc(collection(db, USERS_COLLECTION), {
      email,
      username,
      profileSlug,
      name,
      profileImage: profileImage || '',
      coverImage: '',
      bio: '',
      status: 'active',
      role: 'member',
      createdAt: Timestamp.now(),
      lastActive: Timestamp.now(),
      stats: { posts: 0, followers: 0, following: 0, profileViews: 0, postImpressions: 0 }
    });
    return userRef.id;
  },

  async getUserByEmail(email: string): Promise<CommunityUser | null> {
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', email), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate(), lastActive: doc.data().lastActive?.toDate() } as CommunityUser;
  },

  async getUserByUsername(username: string): Promise<CommunityUser | null> {
    const q = query(collection(db, USERS_COLLECTION), where('username', '==', username), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate(), lastActive: doc.data().lastActive?.toDate() } as CommunityUser;
  },

  async getUserBySlug(profileSlug: string): Promise<CommunityUser | null> {
    const q = query(collection(db, USERS_COLLECTION), where('profileSlug', '==', profileSlug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate(), lastActive: doc.data().lastActive?.toDate() } as CommunityUser;
  },

  async updateUser(userId: string, updates: Partial<CommunityUser>): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, userId), { ...updates, lastActive: Timestamp.now() });
  },

  async updateUserStatus(userId: string, status: CommunityUser['status']): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, userId), { status });
  },

  // Posts
  async createPost(post: Omit<Post, 'id' | 'likes' | 'comments' | 'shares' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const userQuery = query(collection(db, USERS_COLLECTION), where('email', '==', post.userId), limit(1));
    const userSnapshot = await getDocs(userQuery);
    let userSlug = post.userId.split('@')[0];
    
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      userSlug = userData.profileSlug || userSlug;
    }

    const postData: any = {
      userId: post.userId,
      username: post.username,
      userSlug: userSlug,
      content: post.content,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    if (post.userImage) postData.userImage = post.userImage;
    if (post.mediaUrls && post.mediaUrls.length > 0) postData.mediaUrls = post.mediaUrls;
    if (post.linkUrl) postData.linkUrl = post.linkUrl;
    if (post.linkPreview) postData.linkPreview = post.linkPreview;

    const postRef = await addDoc(collection(db, POSTS_COLLECTION), postData);
    
    if (!userSnapshot.empty) {
      await updateDoc(userSnapshot.docs[0].ref, {
        'stats.posts': increment(1)
      });
    }
    
    return postRef.id;
  },

  async getFeed(pageSize = 10, lastDoc?: any): Promise<{ posts: Post[], lastDoc: any }> {
    let q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'), limit(pageSize));
    if (lastDoc) q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize));
    
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Post));
    
    return { posts, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
  },

  async getPostById(postId: string): Promise<Post | null> {
    const docSnap = await getDoc(doc(db, POSTS_COLLECTION, postId));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data(), createdAt: docSnap.data().createdAt?.toDate(), updatedAt: docSnap.data().updatedAt?.toDate() } as Post;
  },

  async getUserPosts(userId: string): Promise<Post[]> {
    const q = query(collection(db, POSTS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Post));
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async deletePost(postId: string, userId: string): Promise<void> {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      'stats.posts': increment(-1)
    });
  },

  // Comments
  async addComment(comment: Omit<Comment, 'id' | 'likes' | 'createdAt'>): Promise<string> {
    const commentRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
      ...comment,
      likes: 0,
      createdAt: Timestamp.now()
    });
    
    await updateDoc(doc(db, POSTS_COLLECTION, comment.postId), {
      comments: increment(1)
    });
    
    const postDoc = await getDoc(doc(db, POSTS_COLLECTION, comment.postId));
    if (postDoc.exists()) {
      const postData = postDoc.data();
      if (postData.userId !== comment.userId) {
        const commenterQuery = query(collection(db, USERS_COLLECTION), where('email', '==', comment.userId), limit(1));
        const commenterSnapshot = await getDocs(commenterQuery);
        if (!commenterSnapshot.empty) {
          const commenterData = commenterSnapshot.docs[0].data();
          const { notificationService } = await import('./notificationService');
          await notificationService.createNotification({
            userId: postData.userId,
            type: 'comment',
            fromUserId: comment.userId,
            fromUserName: commenterData.name,
            fromUserImage: commenterData.profileImage,
            fromUserSlug: commenterData.profileSlug,
            message: `${commenterData.name} commented on your post`,
            relatedId: comment.postId
          });
        }
      }
    }
    
    return commentRef.id;
  },

  async getComments(postId: string): Promise<Comment[]> {
    const q = query(collection(db, COMMENTS_COLLECTION), where('postId', '==', postId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    } as Comment));
  },

  // Likes
  async toggleLike(postId: string, userId: string): Promise<boolean> {
    const likesRef = collection(db, LIKES_COLLECTION);
    const q = query(likesRef, where('userId', '==', userId), where('postId', '==', postId), limit(1));
    const existingLike = await getDocs(q);
    
    if (!existingLike.empty) {
      await deleteDoc(existingLike.docs[0].ref);
      await updateDoc(doc(db, POSTS_COLLECTION, postId), { likes: increment(-1) });
      return false;
    } else {
      await addDoc(likesRef, { userId, postId, createdAt: Timestamp.now() });
      await updateDoc(doc(db, POSTS_COLLECTION, postId), { likes: increment(1) });
      
      const postDoc = await getDoc(doc(db, POSTS_COLLECTION, postId));
      if (postDoc.exists()) {
        const postData = postDoc.data();
        if (postData.userId !== userId) {
          const likerQuery = query(collection(db, USERS_COLLECTION), where('email', '==', userId), limit(1));
          const likerSnapshot = await getDocs(likerQuery);
          if (!likerSnapshot.empty) {
            const likerData = likerSnapshot.docs[0].data();
            const { notificationService } = await import('./notificationService');
            await notificationService.createNotification({
              userId: postData.userId,
              type: 'like',
              fromUserId: userId,
              fromUserName: likerData.name,
              fromUserImage: likerData.profileImage,
              fromUserSlug: likerData.profileSlug,
              message: `${likerData.name} liked your post`,
              relatedId: postId
            });
          }
        }
      }
      return true;
    }
  },

  async hasLiked(postId: string, userId: string): Promise<boolean> {
    const q = query(collection(db, LIKES_COLLECTION), where('userId', '==', userId), where('postId', '==', postId), limit(1));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },

  // Follow System
  async followUser(followerId: string, followingId: string): Promise<void> {
    await addDoc(collection(db, FOLLOWS_COLLECTION), {
      followerId,
      followingId,
      status: 'pending',
      createdAt: Timestamp.now()
    });
    
    // Create notification
    const followerQuery = query(collection(db, USERS_COLLECTION), where('email', '==', followerId), limit(1));
    const followerSnapshot = await getDocs(followerQuery);
    if (!followerSnapshot.empty) {
      const followerData = followerSnapshot.docs[0].data();
      const { notificationService } = await import('./notificationService');
      await notificationService.createNotification({
        userId: followingId,
        type: 'follow_request',
        fromUserId: followerId,
        fromUserName: followerData.name,
        fromUserImage: followerData.profileImage,
        fromUserSlug: followerData.profileSlug,
        message: `${followerData.name} wants to follow you`
      });
    }
  },

  async acceptFollowRequest(followerId: string, followingId: string): Promise<void> {
    const q = query(collection(db, FOLLOWS_COLLECTION), where('followerId', '==', followerId), where('followingId', '==', followingId), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await updateDoc(snapshot.docs[0].ref, { status: 'accepted' });
      
      const followerQuery = query(collection(db, USERS_COLLECTION), where('email', '==', followerId), limit(1));
      const followerSnapshot = await getDocs(followerQuery);
      if (!followerSnapshot.empty) {
        await updateDoc(followerSnapshot.docs[0].ref, { 'stats.following': increment(1) });
      }
      
      const followingQuery = query(collection(db, USERS_COLLECTION), where('email', '==', followingId), limit(1));
      const followingSnapshot = await getDocs(followingQuery);
      if (!followingSnapshot.empty) {
        await updateDoc(followingSnapshot.docs[0].ref, { 'stats.followers': increment(1) });
        const followingData = followingSnapshot.docs[0].data();
        const { notificationService } = await import('./notificationService');
        await notificationService.createNotification({
          userId: followerId,
          type: 'follow_accepted',
          fromUserId: followingId,
          fromUserName: followingData.name,
          fromUserImage: followingData.profileImage,
          fromUserSlug: followingData.profileSlug,
          message: `${followingData.name} accepted your follow request`
        });
      }
    }
  },

  async rejectFollowRequest(followerId: string, followingId: string): Promise<void> {
    const q = query(collection(db, FOLLOWS_COLLECTION), where('followerId', '==', followerId), where('followingId', '==', followingId), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
    }
  },

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const q = query(collection(db, FOLLOWS_COLLECTION), where('followerId', '==', followerId), where('followingId', '==', followingId), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const status = snapshot.docs[0].data().status;
      await deleteDoc(snapshot.docs[0].ref);
      
      if (status === 'accepted') {
        const followerQuery = query(collection(db, USERS_COLLECTION), where('email', '==', followerId), limit(1));
        const followerSnapshot = await getDocs(followerQuery);
        if (!followerSnapshot.empty) {
          await updateDoc(followerSnapshot.docs[0].ref, { 'stats.following': increment(-1) });
        }
        
        const followingQuery = query(collection(db, USERS_COLLECTION), where('email', '==', followingId), limit(1));
        const followingSnapshot = await getDocs(followingQuery);
        if (!followingSnapshot.empty) {
          await updateDoc(followingSnapshot.docs[0].ref, { 'stats.followers': increment(-1) });
        }
      }
    }
  },

  async removeFollower(followerId: string, followingId: string): Promise<void> {
    await this.unfollowUser(followerId, followingId);
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const q = query(collection(db, FOLLOWS_COLLECTION), where('followerId', '==', followerId), where('followingId', '==', followingId), where('status', '==', 'accepted'), limit(1));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },

  async getFollowers(userId: string): Promise<Array<{email: string, user: CommunityUser}>> {
    const q = query(collection(db, FOLLOWS_COLLECTION), where('followingId', '==', userId), where('status', '==', 'accepted'));
    const snapshot = await getDocs(q);
    const followers = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const followerEmail = doc.data().followerId;
        const user = await this.getUserByEmail(followerEmail);
        return { email: followerEmail, user: user! };
      })
    );
    return followers.filter(f => f.user);
  },

  async getFollowing(userId: string): Promise<Array<{email: string, user: CommunityUser}>> {
    const q = query(collection(db, FOLLOWS_COLLECTION), where('followerId', '==', userId), where('status', '==', 'accepted'));
    const snapshot = await getDocs(q);
    const following = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const followingEmail = doc.data().followingId;
        const user = await this.getUserByEmail(followingEmail);
        return { email: followingEmail, user: user! };
      })
    );
    return following.filter(f => f.user);
  },

  async getFollowStatus(followerId: string, followingId: string): Promise<'none' | 'pending' | 'accepted'> {
    const q = query(collection(db, FOLLOWS_COLLECTION), where('followerId', '==', followerId), where('followingId', '==', followingId), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return 'none';
    return snapshot.docs[0].data().status as 'pending' | 'accepted';
  },

  async getPendingFollowRequests(userId: string): Promise<Array<{id: string, followerId: string, createdAt: Date}>> {
    const q = query(collection(db, FOLLOWS_COLLECTION), where('followingId', '==', userId), where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      followerId: doc.data().followerId,
      createdAt: doc.data().createdAt?.toDate()
    }));
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async areMutualFollowers(user1: string, user2: string): Promise<boolean> {
    const following = await this.isFollowing(user1, user2);
    const followedBy = await this.isFollowing(user2, user1);
    return following && followedBy;
  },

  // Admin
  async getAllUsers(): Promise<CommunityUser[]> {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastActive: doc.data().lastActive?.toDate()
    } as CommunityUser));
  }
};
