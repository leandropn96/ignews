import { GetStaticProps } from 'next'
import { clientPrismic } from '../../services/prismic'
import styles from './styles.module.scss'
import { RichText } from 'prismic-dom'

type Post = {
    slug: string,
    title: string,
    except: string,
    updatedAt: string,
}

interface PostsProp {
    posts: Post[]
}

export default function Posts({ posts }: PostsProp) {
    return (
        <>
            <header>
                <title>Pots | Ignews</title>
            </header>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <a key={post.slug} href={post.slug}>
                            <time>{post.updatedAt}</time>
                            <strong>
                                {post.title}
                            </strong>
                            <p>{post.title}</p>
                        </a>
                    ))}
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {

    const data = await clientPrismic.get()
    console.log(JSON.stringify(data, null, 2))

    const posts = data.results.map((post) => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            except: post.data.contente.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    return {
        props: {
            posts
        }
    }
}