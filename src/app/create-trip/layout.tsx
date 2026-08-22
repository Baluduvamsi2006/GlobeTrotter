import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export default function CreateTripLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageContainer}>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
