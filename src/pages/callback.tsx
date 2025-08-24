import { NextPage } from 'next';
import Head from 'next/head';
import PageWithLayoutType from '@/types/layout';
import Main from '@/components/layout/main';
import { useRouter } from "next/router";
import { ImSpinner2 } from 'react-icons/im';
import { useEffect } from 'react';


type Props = object


const Callback: NextPage<Props> = () => {
  const router = useRouter();
  const { token, role } = router.query;

  useEffect(() => {
    if (!router.isReady) return; // tunggu router siap

    if (token && role) {
      localStorage.setItem("token", token as string);

      if ((role as string).toLowerCase() === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/sign-in");
    }
  }, [router.isReady, token, role, router]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME}</title>
        <meta name="theme-color" content={"#FAF5FF"} />
      </Head>
      <div className="h-dvh w-screen flex justify-center items-center">
        <ImSpinner2 className="animate-spin" size={"5rem"} />
      </div>
    </>
  );
};

(Callback as PageWithLayoutType).layout = Main;

export default Callback;