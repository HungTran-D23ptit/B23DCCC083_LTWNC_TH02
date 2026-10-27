import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('trước 300ms vẫn là giá trị cũ, sau khi advance 300ms là giá trị mới', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'mưa', delay: 300 },
      }
    );

    expect(result.current).toBe('mưa');

    rerender({ value: 'mưa rào', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('mưa');

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('mưa rào');
  });

  it('hủy timer trước đó nếu giá trị liên tục thay đổi trước delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'a', delay: 300 },
      }
    );

    rerender({ value: 'ab', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'abc', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('abc');
  });
});
