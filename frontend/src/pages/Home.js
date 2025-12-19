import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  CardActions, 
  Chip, 
  Stack, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Container,
  Grid,
  InputAdornment,
  Paper
} from '@mui/material';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [q, setQ] = useState('');
  const nav = useNavigate();

  useEffect(() => { fetchPosts(); fetchTags(); }, []);

  async function fetchPosts() {
    const res = await API.get('/posts');
    setPosts(res.data);
  }
  async function fetchTags() {
    const res = await API.get('/tags');
    setTags(res.data);
  }

  async function search() {
    const res = await API.get('/search', { params: { q } });
    setPosts(res.data);
  }

  async function deletePost(id) {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  }

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null }
  })();

  const popularTags = tags.slice(0, 8);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Hero Section */}
      <Paper
        sx={{
          p: 5,
          mb: 6,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 4,
          textAlign: 'center'
        }}
        elevation={0}
      >
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Welcome to BlogSphere
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
          Discover amazing stories, share your thoughts, and connect with other writers
        </Typography>
        
        {/* Search Section */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <TextField
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Search for articles, topics, or authors..."
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  🔍
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={search}
                    sx={{ borderRadius: 2 }}
                  >
                    Search
                  </Button>
                </InputAdornment>
              )
            }}
            onKeyPress={(e) => e.key === 'Enter' && search()}
          />
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight={600} color="text.primary">
              Latest Articles
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>

          <Stack spacing={3}>
            {posts.map(p => (
              <Card 
                key={p._id} 
                elevation={2}
                sx={{
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h5" 
                    component={Link} 
                    to={`/posts/${p._id}`} 
                    sx={{ 
                      textDecoration: 'none', 
                      color: 'inherit', 
                      fontWeight: 600,
                      display: 'block',
                      mb: 2,
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {p.title}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    By 
                    <Link 
                      to={`/profile/${p.author?.username}`} 
                      style={{ 
                        color: 'inherit', 
                        textDecoration: 'none',
                        fontWeight: 600,
                        marginLeft: '4px'
                      }}
                    >
                      {p.author?.username}
                    </Link> 
                    • {new Date(p.createdAt).toLocaleString()}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.6 }}>
                    {p.content?.slice(0, 200)}{p.content?.length > 200 ? '...' : ''}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {p.tags?.map(tag => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        sx={{ 
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 3, pb: 2 }}>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/posts/${p._id}`}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  >
                    Read More
                  </Button>
                  {currentUser && p.author && (currentUser.id === (p.author._id || p.author.id)) && (
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => deletePost(p._id)}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Popular Tags */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              🔥 Popular Tags
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {popularTags.map(t => (
                <Chip
                  key={t.tag}
                  label={`${t.tag} (${t.count})`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* All Tags */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              📊 All Tags
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {tags.map(t => (
                <ListItem 
                  key={t.tag} 
                  sx={{ 
                    px: 0,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderRadius: 1
                    }
                  }}
                >
                  <ListItemText 
                    primary={t.tag} 
                    secondary={`${t.count} posts`}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}