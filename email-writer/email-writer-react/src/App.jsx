/**
 * UPDATED FOR 2026 STANDARDS
 * * 1. STATE MANAGEMENT: Replaced manual 'loading' state with React 19 'useTransition'.
 * 2. ASYNC PATTERN: Implemented 'Actions' pattern for non-blocking UI updates.
 * 3. LAYOUT: Migrated from individual margins (sx) to the 'Stack' component (MUI 7 standard).
 * 4. TYPOGRAPHY: Adjusted to high-density typography (h5) common in AI-integrated tools.
 */

import { useState, useTransition } from 'react';
import {
  Box, Button, CircularProgress, Container, FormControl,
  InputLabel, MenuItem, Select, TextField, Typography,
  Alert, Paper, Divider, Stack
} from '@mui/material';
// Icons added for professional 2026 UI standards
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [error, setError] = useState('');

  /**
   * UPDATE: React 19 useTransition
   * Replaces manual setLoading(true/false). isPending is automatically
   * managed by the React 19 background scheduler.
   */
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    // UPDATE: Wrapping async logic in startTransition (The 2026 'Action' pattern)
    startTransition(async () => {
      setError('');
      try {
        const response = await axios.post("http://localhost:8080/api/email/generate", {
          emailContent,
          tone
        });

        const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        setGeneratedReply(data);
      } catch (err) {
        // UPDATE: Improved error messaging for better developer/user feedback
        setError('Connection failed. Ensure the Spring Boot backend is active on port 8080.');
        console.error(err);
      }
    });
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedReply);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      {/* UPDATE: Paper component with 'divider' border is the preferred 2026 'Clean' look */}
      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <Typography variant='h5' component="h1" gutterBottom sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
          Email Response Engine
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Professional AI-generated replies using optimized LLM context.
        </Typography>

        {/* UPDATE: Stack component (MUI 7) replaces repetitive 'mb' sx props */}
        <Stack spacing={3}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            label="Original Email"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Paste the email content here..."
          />

          <FormControl fullWidth>
            <InputLabel id="tone-select-label">Response Tone</InputLabel>
            <Select
              labelId="tone-select-label"
              value={tone}
              label="Response Tone"
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="">Default (Neutral)</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
              <MenuItem value="concise">Concise</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant='contained'
            size="large"
            onClick={handleSubmit}
            // UPDATE: isPending now controls the disabled/loading state
            disabled={!emailContent || isPending}
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
            sx={{ py: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            {isPending ? "Generating..." : "Generate Draft"}
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {generatedReply && (
        <Box sx={{ mt: 4 }}>
          {/* UPDATE: Used Divider with label for better content separation */}
          <Divider sx={{ mb: 4 }}>
            <Typography variant="caption" color="text.secondary">RESULT</Typography>
          </Divider>

          <Paper variant="outlined" sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Typography
              variant='body1'
              sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}
            >
              {generatedReply}
            </Typography>

            <Button
              variant='text'
              startIcon={<ContentCopyIcon />}
              onClick={copyToClipboard}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              Copy to clipboard
            </Button>
          </Paper>
        </Box>
      )}
    </Container>
  );
}

export default App;