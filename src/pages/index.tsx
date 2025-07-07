import PageWithLayoutType from '@/types/layout';
import MainAuth from '@/components/layout/main-auth';
import Dashboard from '@/pages/dashboard';
import AdminDashboard from '@/pages/admin/dashboard';
import { LoginUser } from '@/types/auth';
import { NextPage } from 'next/types';
import { USER_ROLE_ADMIN } from '@/utils/constant';


type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {
  if (loginUser) {
    if (loginUser.user.role === USER_ROLE_ADMIN) {
      return <AdminDashboard />;
    } else {
      return <Dashboard />;
    }
  }
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;