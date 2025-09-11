import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import { Api } from '@/lib/api';
import { CreateCustomer } from '@/types/customer';
import PageWithLayoutType from '@/types/layout';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import notif from "@/utils/notif";
import MainAdmin from '@/components/layout/main-admin';
import { useRef } from 'react';


type Props = object

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  email: Yup.string().email('Invalid email'),
  phoneNumber: Yup.string().required('Required field'),
  address: Yup.string(),
});

const initFormikValue: CreateCustomer = {
  name: '',
  email: '',
  address: '',
  phoneNumber: '',
}

const New: NextPage<Props> = () => {
  const formikRef = useRef<FormikProps<CreateCustomer>>(null);
  const router = useRouter();


  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['customer', 'create'],
    mutationFn: (val: CreateCustomer) => Api.post('/customer', val),
    onSuccess: ({ status, message, payload }) => {
      if (status) {
        notif.success(message);
        // formikHelpers.resetForm();
        router.push('/admin/customer')
      } else if (payload?.listError) {
        formikRef.current?.setErrors(payload.listError);
      } else {
        notif.error(message);
      }
    },
    onError: () => {
      notif.error('Please cek you connection');
    }
  });
  
  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - New Customer'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Customer', path: '/admin/customer' },
            { name: 'Buat', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>New Customer</div>
          </div>
          <div>
            <Formik
              innerRef={formikRef}
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values) => mutateSubmit(values)}
            >
              {({ values, errors }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Customer Name'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Customer Name'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Email'}
                        name={'email'}
                        type={'email'}
                        placeholder={'Email'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Nomor Telepon'}
                        name={'phoneNumber'}
                        type={'text'}
                        placeholder={'Nomor Telepon'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextAreaField
                        label={'Address'}
                        name={'address'}
                        placeholder={'Address'}
                      />
                    </div>
                    <div className="mb-8 max-w-xl">
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    {process.env.DEBUG === 'true' && (
                      <>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(values, null, 4)}
                        </div>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(errors, null, 4)}
                        </div>
                      </>
                    )}
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

(New as PageWithLayoutType).layout = MainAdmin;

export default New;