import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, cloneElement } from 'react';
interface ActiveLink extends LinkProps {
    children: ReactElement
    activeClassName: string
};

export function ActiveLink({ children, activeClassName, ...resp }: ActiveLink) {
    const { asPath } = useRouter();
    const className = asPath === resp.href ? activeClassName : '';
    return (
        <>
            <Link {...resp}>
                {cloneElement(children, { className })}
            </Link>
        </>
    )
}