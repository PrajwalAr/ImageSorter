import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '../toast';

describe('Toast Component', () => {
  // Run tests in series and clean up after each
  afterEach(cleanup);
  
  it('renders with title and description when open', async () => {
    cleanup(); // Extra cleanup before each test
    render(
      <ToastProvider>
        <Toast open={true} onOpenChange={() => {}}>
          <ToastTitle>Test Title</ToastTitle>
          <ToastDescription>Test description</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    // Wait for toast to appear
    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  it('applies destructive variant classes correctly', async () => {
    cleanup(); // Extra cleanup before each test
    render(
      <ToastProvider>
        <Toast variant="destructive" open={true} onOpenChange={() => {}}>
          <ToastTitle>Error</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    // Find the toast by its role and content
    const toast = await screen.findByRole('status');
    expect(toast).toHaveClass('bg-destructive');
    expect(toast).toHaveClass('text-destructive-foreground');
  });

  it('does not render when open is false', async () => {
    cleanup(); // Extra cleanup before each test
    render(
      <ToastProvider>
        <Toast open={false} onOpenChange={() => {}}>
          <ToastTitle>Hidden</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    // Wait to ensure toast doesn't appear
    await waitFor(() => {
      expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });
  });
});
