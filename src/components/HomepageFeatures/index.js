import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const FeatureList = [
    {
        title: 'Politique informatique de l\'Abes',
        Svg: require('../../../static/img/logo-abes-cercle-130x130.svg').default,
        description: (
            <>
                <p>
                    La politique informatique de l'Abes donne un cadre pour structurer la maintenance et les évolutions du système d'information de l'Abes.
                    La politique est en cours de rédaction et elle est structurée en 5 parties :
                    <ul>
                    <li>politique d'infrastructure (🚧 à faire),</li>
                    <li>politique de support informatique (🚧 à faire),</li>
                    <li>politique de développement,</li>
                    <li>politique informatique du labo (🚧 à faire),</li>
                    <li>gouvernance (🚧 à faire)</li>
                    </ul>
                </p>
            </>
        ),
    },

];

function Feature({title, description}) {
    return (
        <div className={clsx('col')}>
            {/*<div className="text--center">*/}
            {/*    <Svg className={styles.featureSvg} role="img" />*/}
            {/*</div>*/}
            <div className="padding-horiz--md">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>

        </section>
    );
}
