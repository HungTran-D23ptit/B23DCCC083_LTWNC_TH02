import React from 'react';
import type { CSSProperties } from 'react';
import type { ListChildComponentProps } from 'react-window';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export interface SongRowData {
  songs: Song[];
  onPlay: (song: Song, index: number) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: (id: string) => boolean;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  hasPlaylists?: boolean;
}

export interface DirectSongRowProps {
  index?: number;
  style?: CSSProperties;
  data?: SongRowData;
  song?: Song;
  onPlay?: (song: Song, index?: number) => void;
  onToggleFavorite?: (id: string) => void;
  isFav?: boolean;
  onAddToQueue?: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  hasPlaylists?: boolean;
}

export type SongRowProps = Partial<ListChildComponentProps<SongRowData>> & DirectSongRowProps;

export const SongRow = React.memo<SongRowProps>((props) => {
  const index = props.index ?? 0;
  const song: Song | undefined = props.song ?? (props.data?.songs ? props.data.songs[index] : undefined);

  if (!song) return null;

  const onPlay = props.onPlay ?? props.data?.onPlay;
  const onToggleFavorite = props.onToggleFavorite ?? props.data?.onToggleFavorite;
  const isFavorite = props.isFav ?? (props.data?.isFavorite ? props.data.isFavorite(song.id) : false);
  const onAddToQueue = props.onAddToQueue ?? props.data?.onAddToQueue;
  const onAddToPlaylist = props.onAddToPlaylist ?? props.data?.onAddToPlaylist;
  const hasPlaylists = props.hasPlaylists ?? props.data?.hasPlaylists ?? false;

  return (
    <div className="song-row" style={props.style} data-testid={`song-row-${song.id}`}>
      <span className="col-index">{index + 1}</span>
      <div className="col-info">
        <span className="song-title">{song.title}</span>
        <span className="song-artist">{song.artist}</span>
      </div>
      <span className="col-genre badge-genre">{song.genre}</span>
      <span className="col-duration">{formatDuration(song.duration)}</span>
      <div className="col-actions">
        <button
          type="button"
          className="btn-action btn-play"
          onClick={() => onPlay?.(song, index)}
          aria-label={`Phát ${song.title}`}
        >
          Phát
        </button>
        <button
          type="button"
          className={`btn-action btn-fav ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite?.(song.id)}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
        <button
          type="button"
          className="btn-action btn-queue"
          onClick={() => onAddToQueue?.(song)}
          aria-label={`Thêm ${song.title} vào hàng đợi`}
        >
          + Hàng đợi
        </button>
        <button
          type="button"
          className="btn-action btn-playlist"
          disabled={!hasPlaylists}
          onClick={() => onAddToPlaylist?.(song)}
          aria-label={`Thêm ${song.title} vào playlist`}
        >
          + Playlist
        </button>
      </div>
    </div>
  );
});

SongRow.displayName = 'SongRow';
export default SongRow;
