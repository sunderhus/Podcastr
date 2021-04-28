import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { useMemo } from 'react';
import styles from './styles.module.scss';

const Header: React.FC = () => {
  const currentDate = useMemo(() => {
    return format(new Date(), 'EEEEEE, d MMMM', {
      locale: ptBR,
    });
  }, []);

  return (
    <header className={styles.container}>
      <img src="/logo.svg" alt="Podcastr" />
      <p>O melhor para você ouvir sempre</p>
      <span>{currentDate}</span>
    </header>
  );
};

export default Header;
