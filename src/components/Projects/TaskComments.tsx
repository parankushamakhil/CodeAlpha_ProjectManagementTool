import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { format } from 'date-fns';
import { Comment } from '../../types';

interface TaskCommentsProps {
  taskId: string;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    if (!taskId) return;
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/tasks/${taskId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchComments();
  }, [taskId]);

  useEffect(() => {
    if (!socket || !taskId) return;

    const handleNewComment = (comment: Comment) => {
      if (comment.taskId === taskId) {
        setComments(prev => [...prev, comment]);
      }
    };

    socket.on('comment-added', handleNewComment);

    return () => {
      socket.off('comment-added', handleNewComment);
    };
  }, [socket, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          userId: user.id,
        }),
      });

      if (response.ok) {
        setNewComment('');
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h4 className="text-lg font-semibold mb-3">Comments</h4>
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {comments.map(comment => (
          <div key={comment.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
              {comment.author?.name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">{comment.author?.name || 'User'}</span>
                <span className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                </span>
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2 mt-1">
                <p className="text-sm text-gray-800">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex space-x-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default TaskComments; 