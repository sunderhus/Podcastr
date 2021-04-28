import ptBR, { format, parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import api from '../../services/api';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  publishedAtFormatted: string;
  durationAsString: string;
  description: string;
  url: string;
  file: {
    duration: number;
  };
}

interface EpisodeProps {
  episode: Episode;
}

const Episode: React.FC<EpisodeProps> = ({ episode }) => {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAtFormatted}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
};

export default Episode;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get<Episode[]>('episodes', {
    params: {
      _limit: 12,
      _sort: 'publishedAt',
      _order: 'desc',
    },
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id,
      } as ParsedUrlQuery,
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params;

  const { data } = await api.get(`episodes/${slug}`);

  const episode = {
    ...data,
    publishedAtFormatted: format(parseISO(data.publishedAt), 'd MMM yy', {
      locale: ptBR,
    }),
    file: {
      duration: Number(data.file.duration),
    },
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
  };

  return {
    props: { episode },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
