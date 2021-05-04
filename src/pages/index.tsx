import ptBR, { format, parseISO } from 'date-fns';

import Link from 'next/link';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useMemo } from 'react';
import api from '../services/api';
import convertDurationToTimeString from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import { usePlayer } from '../hooks/player';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  publishedAtFormatted: string;
  durationAsString: string;
  file: {
    url: string;
    duration: number;
  };
};

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

const Home: React.FC<HomeProps> = ({ allEpisodes, latestEpisodes }) => {
  const { playList } = usePlayer();
  const episodesList = [...latestEpisodes, ...allEpisodes];
  const memoLatestEpisodesLength = useMemo(() => {
    return latestEpisodes.length;
  }, [latestEpisodes.length]);

  return (
    <div className={styles.homepage}>
      <Head>
        <title>PoadCastr - Home </title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos </h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  objectFit="cover"
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button
                  type="button"
                  onClick={() => playList(episodesList, index)}
                >
                  <img src="/play-green.svg" alt="tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th colSpan={1}>Podcast</th>
              <th> </th>
              <th>Integrantes</th>
              <th style={{ width: 100 }}>Data</th>
              <th>Duração</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      {episode.title}
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        playList(episodesList, memoLatestEpisodesLength + index)
                      }
                    >
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get<Episode[]>('episodes', {
    params: {
      _limit: 12,
      _sort: 'publishedAt',
      _order: 'desc',
    },
  });

  const episodes = data.map(episode => {
    return {
      ...episode,
      publishedAtFormatted: format(parseISO(episode.publishedAt), 'd MMM yy', {
        locale: ptBR,
      }),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration),
      ),
    };
  });
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return {
    props: {
      allEpisodes,
      latestEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
