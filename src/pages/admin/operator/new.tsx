import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import MainAuth from '@/components/layout/main-auth';
import { Api } from '@/lib/api';
import { CreateUser } from '@/types/user';
import PageWithLayoutType from '@/types/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import notif from "@/utils/notif";
import PasswordField from '@/components/formik/password-field';
import DateField from '@/components/formik/date-field';
import { displayDateForm } from '@/utils/formater';
import CheckboxField from '@/components/formik/checkbox-field';
import { useEffect, useState } from 'react';
import { PageWarehouse, WarehouseView } from '@/types/warehouse';
import DropdownField from '@/components/formik/dropdown-field';
import MainAdmin from '@/components/layout/main-admin';


type Props = object

const schema = Yup.object().shape({
  warehouseId: Yup.string().required('Required field'),
  fullname: Yup.string().required('Required field'),
  email: Yup.string().email('Invalid email').required('Required field'),
  username: Yup.string().required('Required field').min(4, "Username must be at least 6 characters").lowercase(),
  phoneNumber: Yup.string().required('Required field').min(8, "Phone number must be at least 8 characters").max(15, 'Phone number must be 15 characters or less'),
  address: Yup.string(),
  passwd: Yup.string().required("Required field").min(6, "Password must be at least 6 characters"),
  birthPlace: Yup.string(),
  birthDt: Yup.string(),
});

const initFormikValue: CreateUser = {
  warehouseId: '',
  fullname: '',
  email: '',
  address: '',
  phoneNumber: '',
  username: '',
  passwd: '',
  birthDt: '',
  birthPlace: '',
  stockIn: false,
  transferOut: false,
  transferIn: false,
  purchaseOrder: false,
  retail: false,
}

const pageRequestWarehouse: PageWarehouse = {
  limit: -1,
}

const New: NextPage<Props> = () => {
  const router = useRouter();

  const [warehouses, setWarehouses] = useState<WarehouseView[]>([]);


  const { data: loginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['user', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/user', val),
  });

  const { isLoading: isLoadingWarehouse, data: dataWarehouse } = useQuery({
    queryKey: ['warehouse', pageRequestWarehouse],
    queryFn: ({ queryKey }) => Api.get('/warehouse', queryKey[1] as object),
  });

  const handleSubmit = async (values: CreateUser, formikHelpers: FormikHelpers<CreateUser>) => {
    values.username = values.username.toLowerCase()
    values.birthDt = (values.birthDt ? new Date(values.birthDt as string).toISOString() : null)

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/admin/operator')
        } else if (payload?.listError) {
          if (values.birthDt) {
            values.birthDt = displayDateForm(values.birthDt)
          } else {
            values.birthDt = ''
          }
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

  const handleClearBirthDt = (setFieldValue) => {
    setFieldValue('birthDt', '')
  }

  useEffect(() => {
    if (dataWarehouse?.status) {
      setWarehouses(dataWarehouse.payload.list);
    }
  }, [dataWarehouse]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Buat operator'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'operator', path: '/admin/operator' },
            { name: 'Buat', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Buat operator</div>
          </div>
          <div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values, setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4 max-w-xl">
                      <DropdownField
                        label={"Warehouse"}
                        name={"warehouseId"}
                        items={warehouses}
                        keyValue={"id"}
                        keyLabel={"name"}
                        isLoading={isLoadingWarehouse}
                        placeholder="Select Warehouse"
                        placeholderValue={""}
                        field={true}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Name User'}
                        name={'fullname'}
                        type={'text'}
                        placeholder={'Name User'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Username'}
                        name={'username'}
                        type={'text'}
                        placeholder={'Username'}
                        className={'lowercase'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Email'}
                        name={'email'}
                        type={'email'}
                        placeholder={'Email'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Phone Number'}
                        name={'phoneNumber'}
                        type={'text'}
                        placeholder={'Phone Number'}
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
                    <div className="mb-4 max-w-xl">
                      <PasswordField
                        label={'Password'}
                        name={'passwd'}
                        placeholder={'Password'}
                        autoComplete={'off'}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextField
                        label={'Tempat Lahir'}
                        name={'birthPlace'}
                        type={'text'}
                        placeholder={'Tempat Lahir'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <DateField
                        label={'Tanggal Lahir'}
                        name={'birthDt'}
                        type={'date'}
                        handleClear={() => handleClearBirthDt(setFieldValue)}
                      />
                    </div>
                    <div>
                      <div className='mb-4'>
                        <div className='text-lg'>Privillege</div>
                      </div>
                      <div className="mb-4 max-w-xl grid grid-cols-2 gap-4">
                        <div className="">
                          <CheckboxField
                            name="stockIn"
                            label="Stock In"
                          />
                        </div>
                        <div className="">
                          <CheckboxField
                            name="transferIn"
                            label="Transfer In"
                          />
                        </div>
                        <div className="">
                          <CheckboxField
                            name="transferOut"
                            label="Transfer Out"
                          />
                        </div>
                        <div className="">
                          <CheckboxField
                            name="purchaseOrder"
                            label="Purchase Order"
                          />
                        </div>
                        <div className="">
                          <CheckboxField
                            name="retail"
                            label="Retail"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-8 max-w-xl">
                      <ButtonSubmit
                        label={'Save'}
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

(New as PageWithLayoutType).layout = MainAdmin;

export default New;