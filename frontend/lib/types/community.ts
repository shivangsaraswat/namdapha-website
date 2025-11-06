export type PostType = 'post' | 'announcement' | 'article';
export type ReactionType = 'like' | 'helpful' | 'celebrate';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: 'admin' | 'verified' | 'member';
  authorAvatar?: string;
  type: PostType;
  isPinned: boolean;
  isPublished: boolean;
  reactions: Record<ReactionType, number>;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: 'admin' | 'verified' | 'member';
  content: string;
  reactions: Record<ReactionType, number>;
  createdAt: Date;
}

export interface CreatePostData {
  title: string;
  content: string;
  type: PostType;
  tags: string[];
}
