import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const products = [
  {
    name: 'MDD400',
    full: 'Marine Data Display',
    description: 'NMEA 2000 and Legacy Serial data display for marine applications.',
    to: '/mdd400/v2.9',
    hero: true,
  },
  {
    name: 'WTI400',
    full: 'Analog Wind Transducer Interface',
    description: 'Converts analog wind transducer signals to NMEA 2000.',
    to: '/wti400/v1.2',
  },
  {
    name: 'CANBench Duo',
    full: 'CANBench Duo',
    description: 'Dual-channel CAN bus development and testing tool.',
    to: '/canbench-duo',
  },
  {
    name: 'CANBench TrueZ',
    full: 'CANBench TrueZ',
    description: 'CAN bus termination and impedance verification tool.',
    to: '/canbench-truez',
  },
];

function HeroProduct({name, full, description, to}) {
  return (
    <div className={styles.hero}>
      <div className="container">
        <h1 className={styles.heroTitle}>{name}</h1>
        <p className={styles.heroSubtitle}>{full}</p>
        <p className={styles.heroDescription}>{description}</p>
        <Link className="button button--primary button--lg" to={to}>
          View Documentation
        </Link>
      </div>
    </div>
  );
}

function ProductCard({name, full, description, to}) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{name}</h2>
      <p className={styles.cardSubtitle}>{full}</p>
      <p className={styles.cardDescription}>{description}</p>
      <Link className="button button--outline button--primary" to={to}>
        View Docs
      </Link>
    </div>
  );
}

export default function Home() {
  const [hero, ...secondary] = products;
  return (
    <Layout title="Scadys Docs" description="Technical documentation for Scadys products">
      <HeroProduct {...hero} />
      <main className={styles.secondary}>
        <div className="container">
          <div className={styles.cardGrid}>
            {secondary.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
