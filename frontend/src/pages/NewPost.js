import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  Stack,
  Container,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState(null);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const tagArray = tags.split(',').map(t=>t.trim()).filter(Boolean);
      const res = await API.post('/posts', { title, content, tags: tagArray });
      nav(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  }

  return (
    <Box>
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <IconButton onClick={() => nav(-1)} sx={{ mr: 2 }}>
            ←
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Create New Post
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper 
          sx={{ 
            p: 5, 
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
          }} 
          elevation={0}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" gutterBottom fontWeight={700} color="primary">
              📝 Create New Post
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Share your thoughts with the community
            </Typography>
          </Box>

          <Box component="form" onSubmit={submit}>
            <Stack spacing={3}>
              <TextField 
                label="Post Title" 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                fullWidth 
                variant="outlined"
                placeholder="Enter a compelling title..."
                required
              />
              <TextField 
                label="Content" 
                value={content} 
                onChange={e=>setContent(e.target.value)} 
                multiline 
                rows={12} 
                fullWidth 
                variant="outlined"
                placeholder="Write your post content here..."
                required
              />
              <TextField 
                label="Tags (comma separated)" 
                value={tags} 
                onChange={e=>setTags(e.target.value)} 
                fullWidth 
                variant="outlined"
                placeholder="technology, programming, web-development"
                helperText="Add relevant tags to help readers find your post"
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ py: 1.5, mt: 2 }}
              >
                Publish Post
              </Button>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}