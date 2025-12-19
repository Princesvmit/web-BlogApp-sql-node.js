import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Divider, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Container,
  Avatar,
  Chip
} from '@mui/material';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  async function fetchProfile() {
    try {
      const res = await API.get(`/profile/${username}`);
      setProfile(res.data.user);
      setPosts(res.data.posts);
    } catch (err) {
      console.error(err);
    }
  }

  if (!profile) return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h6">Loading...</Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper 
        sx={{ 
          p: 5, 
          mb: 6, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }} 
        elevation={0}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
            bgcolor: 'white',
            color: 'primary.main',
            fontSize: '3rem',
            fontWeight: 'bold',
            border: '4px solid rgba(255,255,255,0.3)'
          }}
        >
          {profile.username?.charAt(0).toUpperCase()}
        </Avatar>
        
        <Typography variant="h3" gutterBottom fontWeight={700}>
          {profile.username}
        </Typography>
        
        <Stack 
          direction="row" 
          spacing={3} 
          justifyContent="center" 
          alignItems="center" 
          sx={{ mt: 2 }}
        >
          <Chip 
            label={`Joined ${new Date(profile.createdAt).toLocaleDateString()}`}
            variant="outlined"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)'
            }}
          />
          <Chip 
            label={`${posts.length} posts`}
            variant="outlined"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)'
            }}
          />
        </Stack>
      </Paper>

      {/* Posts Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          📄 Blog Posts
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>

      {posts.length > 0 ? (
        <Grid container spacing={3}>
          {posts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <CardActionArea component={Link} to={`/posts/${post._id}`} sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" noWrap gutterBottom>
                      {post.title}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{
                        flexGrow: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5
                      }}
                    >
                      {post.content}
                    </Typography>

                    {post.tags && post.tags.length > 0 && (
                      <Stack direction="row" spacing={0.5} sx={{ mt: 2, flexWrap: 'wrap', gap: 0.5 }}>
                        {post.tags.slice(0, 2).map(tag => (
                          <Chip 
                            key={tag} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        ))}
                        {post.tags.length > 2 && (
                          <Chip 
                            label={`+${post.tags.length - 2}`} 
                            size="small" 
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        )}
                      </Stack>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper 
          sx={{ 
            p: 8, 
            textAlign: 'center',
            borderRadius: 4,
            backgroundColor: 'grey.50'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.username} hasn't published any blog posts yet.
          </Typography>
        </Paper>
      )}
    </Container>
  );
}