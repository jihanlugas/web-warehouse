import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import MainAuth from '@/components/layout/main-auth';
import { Api } from '@/lib/api';
import { ChangePassword } from '@/types/user';
import PageWithLayoutType from '@/types/layout';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import notif from "@/utils/notif";
import PasswordField from '@/components/formik/password-field';
import { LoginUser } from '@/types/auth';


type Props = {
  loginUser: LoginUser
}

const schema = Yup.object().shape({
  currentPasswd: Yup.string().label('Password lama').required(),
  passwd: Yup.string().label('Password baru').required(),
  confirmPasswd: Yup.string().label('Ulangi password baru').oneOf([Yup.ref('passwd'), null], 'Ulangi password harus baru sama dengan password baru').required(),
});

const initFormikValue: ChangePassword = {
  currentPasswd: '',
  passwd: '',
  confirmPasswd: '',
};

const ChangePasswordPage: NextPage<Props> = ({ loginUser }) => {
  const router = useRouter();

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['user', 'change-password'],
    mutationFn: (val: FormikValues) => Api.post('/user/change-password', val),
  });

  const handleSubmit = async (values: ChangePassword, formikHelpers: FormikHelpers<ChangePassword>) => {
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          if (loginUser.user.role === 'ADMIN') {
            router.push('/admin/dashboard')
          } else {
            router.push('/dashboard')
          }
        } else if (payload?.listError) {
          formikHelpers.setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      }
    });
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Ganti Password'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Akun', path: '/dashboard' },
            { name: 'Ganti Password', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Buat User</div>
          </div>
          <div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4 max-w-xl">
                      <PasswordField
                        label={'Password lama'}
                        name={'currentPasswd'}
                        placeholder={'Password lama'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <PasswordField
                        label={'Password baru'}
                        name={'passwd'}
                        placeholder={'Password baru'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <PasswordField
                        label={'Ulangi password baru'}
                        name={'confirmPasswd'}
                        placeholder={'Ulangi password baru'}
                        required
                      />
                    </div>
                    <div className="mb-8 max-w-xl">
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div> */}
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(errors, null, 4)}
                    </div> */}
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

(ChangePasswordPage as PageWithLayoutType).layout = MainAuth;

export default ChangePasswordPage;