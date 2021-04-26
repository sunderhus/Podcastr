import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from "./home.module.scss";
import Image from 'next/image'

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  published_at: string;
  publishedAt: string;
  durationAsString: string;
  url: string;
  file: {
    duration: number;
  }
}

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}


const Home:React.FC<HomeProps> = ({ allEpisodes, latestEpisodes })=> {

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  objectFit={"cover"}
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

                <button type="button">
                  <img src="/play-green.svg" alt="tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>

        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>

          <thead>
            <tr>
              <th colSpan={1}>Podcast</th>
              <th></th>
              <th>Integrantes</th>
              <th style={{ width: 100 }}>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episodes => {
              return (
                <tr key={episodes.id}>
                  <td>
                    <Image
                      width={120}
                      height={120}
                      src={episodes.thumbnail}
                      alt={episodes.title}
                      objectFit="cover" />
                  </td>
                  <td>
                    <Link href={`/episodes/${episodes.id}`}>{episodes.title}</Link>
                  </td>
                  <td>{episodes.members}</td>
                  <td>{episodes.publishedAt}</td>
                  <td>{episodes.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

    </div>
  )
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get<Episode[]>('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      ...episode,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      file: {
        duration: Number(episode.file.duration)
      },
      durationAsString: convertDurationToTimeString(Number(episode.file.duration))
    }
  })
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latestEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}