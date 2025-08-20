import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextField from '@/components/formik/text-field';
import { Api } from '@/lib/api';
import PageWithLayoutType from '@/types/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import notif from "@/utils/notif";
import MainOperator from '@/components/layout/main-operator';
import DropdownField from '@/components/formik/dropdown-field';
import { useState, useEffect } from 'react';
import TextFieldNumber from '@/components/formik/text-field-number';
import { PageVehicle, VehicleView } from '@/types/vehicle';
import { PageRetail, RetailView } from '@/types/retail';
import { displayNumber, displayPhoneNumber } from '@/utils/formater';
import { LoginUser } from '@/types/auth';
import { CreateStockmovementvehicleRetail } from '@/types/stockmovementvehicleretail';


type Props = {
  loginUser: LoginUser
}

const schema = Yup.object().shape({
  isDirect: Yup.boolean(),
  isNewVehiclerdriver: Yup.boolean(),
  retailId: Yup.string().required('Required Field'),
  vehicleId: Yup.string().when('isNewVehiclerdriver', {
    is: false,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  plateNumber: Yup.string().when('isNewVehiclerdriver', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  vehicleName: Yup.string().when('isNewVehiclerdriver', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  driverName: Yup.string().when('isNewVehiclerdriver', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  phoneNumber: Yup.string().when('isNewVehiclerdriver', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  sentGrossQuantity: Yup.number(),
  sentTareQuantity: Yup.number(),
  sentNetQuantity: Yup.number(),
  stockmovementvehicleId: Yup.string().when('isDirect', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
});

const initFormikValue: CreateStockmovementvehicleRetail = {
  isNewVehiclerdriver: false,
  plateNumber: '',
  vehicleName: '',
  nik: '',
  driverName: '',
  phoneNumber: '',
  retailId: '',
  notes: '',
  productId: '',
  vehicleId: '',
  sentGrossQuantity: '',
  sentTareQuantity: '',
  sentNetQuantity: '',
}

const pageRequestRetail: PageRetail = {
  limit: -1,
  preloads: "Customer,Retailproducts,Retailproducts.Product",
  retailStatus: "OPEN",
}

const pageRequestVehicle: PageVehicle = {
  limit: -1,
}

const New: NextPage<Props> = ({  }) => {

  const router = useRouter();
  const [retail, setRetail] = useState<RetailView>(null);
  const [products, setProducts] = useState<unknown[]>([]);
  const [retails, setRetails] = useState<(RetailView & { label: string })[]>([]);
  const [vehicles, setVehicles] = useState<(VehicleView & { label: string })[]>([]);

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['stockmovementvehicle', 'retail', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/stockmovementvehicle/retail', val),
  });


  const { isLoading: isLoadingRetail, data: dataRetail } = useQuery({
    queryKey: ['retail', pageRequestRetail],
    queryFn: ({ queryKey }) => Api.get('/retail', queryKey[1] as object),
  });

  const { isLoading: isLoadingVehicle, data: dataVehicle } = useQuery({
    queryKey: ['vehicle', pageRequestVehicle],
    queryFn: ({ queryKey }) => Api.get('/vehicle', queryKey[1] as object),
  });


  useEffect(() => {
    if (dataRetail?.status) {
      const newList = []
      dataRetail.payload.list.map(data => {
        newList.push({
          ...data,
          label: data.number + ' | ' + data.customer.name
        })
      })
      setRetails(newList);
    }
  }, [dataRetail]);

  useEffect(() => {
    if (dataVehicle?.status) {
      const newList = []
      dataVehicle.payload.list.map(data => {
        newList.push({
          ...data,
          label: data.plateNumber + ' | ' + data.driverName
        })
      })
      setVehicles(newList);
    }
  }, [dataVehicle]);

  const handleChangeVehicleType = (setFieldValue, val: boolean) => {
    setFieldValue('isNewVehiclerdriver', val);
    setFieldValue('vehicleId', '');
    setFieldValue('plateNumber', '');
    setFieldValue('vehicleName', '');
    setFieldValue('driverName', '');
    setFieldValue('phoneNumber', '');
  }

  const handleSubmit = async (values: CreateStockmovementvehicleRetail, formikHelpers: FormikHelpers<CreateStockmovementvehicleRetail>) => {
    values.sentGrossQuantity = parseFloat(values.sentGrossQuantity as string) || 0
    values.sentTareQuantity = parseFloat(values.sentTareQuantity as string) || 0
    values.sentNetQuantity = values.sentGrossQuantity - values.sentTareQuantity
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/retail')
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

  const handleChangeRetail = (e, setFieldValue) => {
    const newProduct = []
    const data = retails.find(retail => retail.id == e.target.value)
    retails.find(retail => retail.id == e.target.value)
    setFieldValue('retailId', e.target.value)

    data.retailproducts.map(retailproduct => {
      newProduct.push({ id: retailproduct.product?.id, name: retailproduct.product?.name })
    })
    setProducts(newProduct)
    setRetail(data)
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - New Retail'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Retail', path: '/retail' },
            { name: 'Buat', path: '' },
          ]}
        />
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
                  <div className='bg-white mb-4 p-4 rounded shadow'>
                    <div className='mb-4'>
                      <div className='text-xl'>Retail</div>
                    </div>
                    <div className="mb-2 max-w-xl">
                      <DropdownField
                        label={"Retail"}
                        name={"retailId"}
                        items={retails}
                        keyValue={"id"}
                        keyLabel={"label"}
                        isLoading={isLoadingRetail}
                        placeholder="Pilih Retail"
                        placeholderValue={""}
                        field={true}
                        onChange={(e) => handleChangeRetail(e, setFieldValue)}
                        required
                      />
                    </div>
                    {retail && (
                      <div className='max-w-xl bg-gray-100 p-2 rounded'>
                        <div className='text-lg font-bold'>{retail.number}</div>
                        <div className='mb-2'>{retail.customer?.name}</div>
                        <div className='mb-2'>{displayPhoneNumber(retail.customer?.phoneNumber)}</div>
                      </div>
                    )}
                  </div>
                  {retail && (
                    <div className='bg-white mb-4 p-4 rounded shadow'>
                      <div className='mb-4'>
                        <div className='text-xl'>New Delivery</div>
                      </div>
                      <div className="mb-4 max-w-xl">
                        <DropdownField
                          label={"Product"}
                          name={"productId"}
                          items={products}
                          keyValue={"id"}
                          keyLabel={"name"}
                          // isLoading={isLoadingVehicle}
                          placeholder="Pilih Product"
                          placeholderValue={""}
                          field={true}
                          required
                        />
                      </div>
                      <div className="mb-4 max-w-xl ">
                        <div className="flex items-center">
                          <label className="flex items-center mr-4">
                            <input type="radio" className="h-4 w-4 mr-2 accent-current" name="custamerType" value={"old"} onChange={() => handleChangeVehicleType(setFieldValue, false)} checked={!values.isNewVehiclerdriver} />
                            <span>Kendaraan Tersimpan</span>
                          </label>
                          <label className="flex items-center mr-4">
                            <input type="radio" className="h-4 w-4 mr-2 accent-current" name="custamerType" value={"new"} onChange={() => handleChangeVehicleType(setFieldValue, true)} checked={values.isNewVehiclerdriver} />
                            <span>Kendaraan Baru</span>
                          </label>
                        </div>
                      </div>
                      {values.isNewVehiclerdriver ? (
                        <>
                          <div className="mb-4 max-w-xl">
                            <TextField
                              label={'Kendaraan'}
                              name={'vehicleName'}
                              type={'text'}
                              placeholder={'Kendaraan'}
                              required
                            />
                          </div>
                          <div className="mb-4 max-w-xl">
                            <TextField
                              label={'Nomor Kendaraan'}
                              name={'plateNumber'}
                              type={'text'}
                              placeholder={'B 123...'}
                              className='uppercase'
                              required
                            />
                          </div>
                          <div className="mb-4 max-w-xl">
                            <TextField
                              label={'Nama Supir / Penanggung Jawab'}
                              name={'driverName'}
                              type={'text'}
                              placeholder={'Nama Supir / Penanggung Jawab'}
                              required
                            />
                          </div>
                          <div className="mb-4 max-w-xl">
                            <TextField
                              label={'Nomor Telepon'}
                              name={'phoneNumber'}
                              type={'text'}
                              placeholder={'628...'}
                              required
                            />
                          </div>
                        </>
                      ) : (
                        <div className="mb-4 max-w-xl">
                          <DropdownField
                            label={"Kendaraan"}
                            name={"vehicleId"}
                            items={vehicles}
                            keyValue={"id"}
                            keyLabel={"label"}
                            isLoading={isLoadingVehicle}
                            placeholder="Pilih Vehicle"
                            placeholderValue={""}
                            field={true}
                            required
                          />
                        </div>
                      )}
                      <div className="mb-4 max-w-xl">
                        <TextFieldNumber
                          label={'Berat Kosong'}
                          name={`sentTareQuantity`}
                          placeholder={'1...'}
                        />
                      </div>
                      <div className="mb-4 max-w-xl">
                        <TextFieldNumber
                          label={'Berat Kotor'}
                          name={`sentGrossQuantity`}
                          placeholder={'1...'}
                        />
                      </div>
                      <div className="mb-4 max-w-xl">
                        <div>Berat Bersih</div>
                        <div>{displayNumber((parseFloat(values.sentGrossQuantity as string || "0") - parseFloat(values.sentTareQuantity as string || "0")))}</div>
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
                    </div>
                  )}
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

(New as PageWithLayoutType).layout = MainOperator;

export default New;