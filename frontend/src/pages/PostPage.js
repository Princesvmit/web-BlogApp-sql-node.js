import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Chip, 
  Stack, 
  Divider, 
  Paper,
  Container,
  Avatar,
  Card,
  CardContent
} from '@mui/material';

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const nav = useNavigate();

  useEffect(() => { fetch(); }, [id]);

  async function fetch() {
    const res = await API.get(`/posts/${id}`);
    setPost(res.data.post);
    setComments(res.data.comments);
    setEditTitle(res.data.post?.title || '');
    setEditContent(res.data.post?.content || '');
    setEditTags((res.data.post?.tags || []).join(', '));
  }

  async function addComment(e) {
    e.preventDefault();
    try {
      const res = await API.post(`/comments/${id}`, { content: commentText });
      setComments(prev => [...prev, res.data]);
      setCommentText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Login required');
    }
  }

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null }
  })();
  const isAuthor = currentUser && post && post.author && (currentUser.id === (post.author._id || post.author.id));

  async function saveEdit() {
    try {
      const tagsArr = editTags.split(',').map(t=>t.trim()).filter(Boolean);
      const res = await API.put(`/posts/${id}`, { title: editTitle, content: editContent, tags: tagsArr });
      setPost(res.data);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    }
  }

  async function deletePost() {
    if (!confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  }

  if (!post) return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h6">Loading...</Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        onClick={() => nav(-1)}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        ← Back
      </Button>

      {editing ? (
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Edit Post
          </Typography>
          <Stack spacing={3}>
            <TextField 
              label="Title" 
              value={editTitle} 
              onChange={e=>setEditTitle(e.target.value)} 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Content" 
              value={editContent} 
              onChange={e=>setEditContent(e.target.value)} 
              multiline 
              rows={12} 
              fullWidth 
              variant="outlined"
            />
            <TextField 
              label="Tags (comma separated)" 
              value={editTags} 
              onChange={e=>setEditTags(e.target.value)} 
              fullWidth 
              variant="outlined"
            />
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={saveEdit}
                size="large"
              >
                Save Changes
              </Button>
              <Button 
                variant="outlined" 
                onClick={()=>setEditing(false)}
                size="large"
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ) : (
        <>
          {/* Post Content */}
          <Paper sx={{ p: { xs: 3, md: 6 }, mb: 4 }} elevation={2}>
            <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
              {post.title}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 48,
                  height: 48
                }}
              >
                {post.author?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  <Link 
                    to={`/profile/${post.author?.username}`} 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none'
                    }}
                  >
                    {post.author?.username}
                  </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: 'text.primary'
              }}
            >
              {post.content}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {post.tags?.map(tag => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                <Button variant="outlined">❤️ Like</Button>
                <Button variant="outlined">🔗 Share</Button>
              </Stack>
              
              {isAuthor && (
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={()=>setEditing(true)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={deletePost}
                  >
                    🗑️ Delete
                  </Button>
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* Comments Section */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Comments ({comments.length})
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {/* Add Comment */}
            {currentUser && (
              <Card sx={{ mb: 4 }} elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Add a Comment
                  </Typography>
                  <Box component="form" onSubmit={addComment}>
                    <TextField
                      label="Your comment..."
                      value={commentText}
                      onChange={e=>setCommentText(e.target.value)}
                      multiline
                      rows={3}
                      fullWidth
                      sx={{ mb: 2 }}
                      variant="outlined"
                    />
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                    >
                      Post Comment
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Comments List */}
            <Stack spacing={3}>
              {comments.map(c => (
                <Card key={c._id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                          {c.author?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            <Link 
                              to={`/profile/${c.author?.username}`} 
                              style={{ 
                                color: 'inherit', 
                                textDecoration: 'none'
                              }}
                            >
                              {c.author?.username}
                            </Link>
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(c.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>
                      
                      {currentUser && c.author._id === currentUser.id && (
                        <Button 
                          size="small" 
                          color="error" 
                          variant="outlined"
                          onClick={async () => {
                            if (!confirm('Delete this comment?')) return;
                            try {
                              await API.delete(`/comments/${c._id}`);
                              setComments(comments.filter(comment => comment._id !== c._id));
                            } catch (err) {
                              alert('Failed to delete comment');
                            }
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {c.content}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {comments.length === 0 && (
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  fontStyle: 'italic'
                }}
              >
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>
        </>
      )}
    </Container>
  );
}