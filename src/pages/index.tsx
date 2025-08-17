import PageWithLayoutType from '@/types/layout';
import MainAuth from '@/components/layout/main-auth';
import { LoginUser } from '@/types/auth';
import { NextPage } from 'next/types';
import { USER_ROLE_ADMIN } from '@/utils/constant';
import { useRouter } from 'next/router';


type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {
  const router = useRouter();
  if (loginUser) {
    if (loginUser.user.userRole === USER_ROLE_ADMIN) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }
  return null
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;