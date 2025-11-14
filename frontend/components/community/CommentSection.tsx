"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { communityService, Comment } from '@/lib/communityService';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  postId: string;
  currentUser: { id: string; username: string; image?: string } | null;
}

export default function CommentSection({ postId, currentUser }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const fetchedComments = await communityService.getComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setSubmitting(true);
    try {
      await communityService.addComment({
        postId,
        userId: currentUser.id,
        username: currentUser.username,
        userImage: currentUser.image,
        content: newComment.trim()
      });
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 p-4 space-y-4">
      {/* Comment Input */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0">
            {currentUser.image ? (
              <Image src={currentUser.image} alt={currentUser.username} width={40} height={40} className="object-cover" />
            ) : (
              <span className="text-white font-semibold">{currentUser.username[0].toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                {comment.userImage ? (
                  <Image src={comment.userImage} alt={comment.username} width={40} height={40} className="object-cover" />
                ) : (
                  <span className="text-white font-semibold text-sm">{comment.username[0].toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl px-4 py-2">
                  <h4 className="font-semibold text-sm text-gray-900">{comment.username}</h4>
                  <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 px-4">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </span>
                  <button className="text-xs text-gray-600 hover:text-blue-600 font-medium">Like</button>
                  <button className="text-xs text-gray-600 hover:text-blue-600 font-medium">Reply</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
