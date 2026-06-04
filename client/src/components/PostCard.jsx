import { useState } from 'react';
import { Link } from 'react-router-dom';
import { likePost } from '../api';

export default function PostCard({ post, onDelete, isOwner }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  async function handleLike() {
    if (liked || liking) return;
    setLiking(true);
    try {
      const res = await likePost(post.id);
      setLikes(res.data.likes);
      setLiked(true);
    } catch {}
    setLiking(false);
  }

  const initial = post.author_name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="buzz-card">
      {post.media_path ? (
        post.media_type === 'video' ? (
          <video className="buzz-media" src={post.media_path} controls muted playsInline />
        ) : (
          <img
            className="buzz-media"
            src={post.media_path}
            alt={post.title}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.style.setProperty('display', 'flex'); }}
          />
        )
      ) : null}
      {!post.media_path && <div className="buzz-media-placeholder">📢</div>}

      <div className="buzz-body">
        <div className="buzz-title">{post.title}</div>
        {post.description && <div className="buzz-desc" style={{ marginTop: '6px' }}>{post.description}</div>}
        {post.vendor_name && (
          <Link
            to={`/stands/${post.stand_id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '.8rem', color: 'var(--primary-dark)', fontWeight: 700, textDecoration: 'none' }}
          >
            🏪 {post.vendor_name}
          </Link>
        )}
      </div>

      <div className="buzz-footer">
        <div className="buzz-author">
          <div className="buzz-author-avatar">
            {post.author_pic ? (
              <img src={post.author_pic} alt={post.author_name} />
            ) : initial}
          </div>
          <div>
            <div className="buzz-author-name">{post.author_name}</div>
            <div className="buzz-author-stand">{new Date(post.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="buzz-likes">
            <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike} disabled={liking}>
              {liked ? '❤️' : '🤍'}
            </button>
            {likes}
          </div>
          {isOwner && (
            <button
              className="btn btn-red btn-sm"
              onClick={() => onDelete(post.id)}
              style={{ padding: '4px 10px', fontSize: '.75rem' }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
