import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { UpdateUser } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { ImSpinner2 } from 'react-icons/im';
import { IoClose } from "react-icons/io5";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import notif from "@/utils/notif";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import DateField from "../formik/date-field";
import { displayDateForm } from "@/utils/formater";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
  fullname: Yup.string().required('Required field'),
  email: Yup.string().email('Invalid email'),
  username: Yup.string().required('Required field').min(4, "Username must be at least 6 characters").lowercase(),
  phoneNumber: Yup.string().required('Required field').min(8, "Phone number must be at least 8 characters").max(15, 'Phone number must be 15 characters or less'),
  address: Yup.string(),
  birthPlace: Yup.string(),
  birthDt: Yup.string(),
});

const defaultInitFormikValue: UpdateUser = {
  fullname: '',
  email: '',
  address: '',
  phoneNumber: '',
  username: '',
  birthDt: '',
  birthPlace: ''
}

const ModalEditUser: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState<UpdateUser>(defaultInitFormikValue)

  const preloads = 'Warehouse'
  const { data, isLoading } = useQuery({
    queryKey: ['user', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/user/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['user', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/user/' + selectedId, val),
  });

  const handleSubmit = async (values: UpdateUser, formikHelpers: FormikHelpers<UpdateUser>) => {
    values.birthDt = (values.birthDt ? new Date(values.birthDt as string).toISOString() : null)
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          onClickOverlay('', true)
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
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          fullname: data.payload.fullname,
          email: data.payload.email,
          phoneNumber: data.payload.phoneNumber,
          username: data.payload.username,
          address: data.payload.address,
          birthDt: displayDateForm(data.payload.birthDt),
          birthPlace: data.payload.birthPlace,
        })
      }
    }
  }, [data])

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
    }
  }, [show, id])

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Operator</div>
          <button type="button" onClick={() => onClickOverlay('', true)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4 border-gray-200" />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="py-20">
              <ImSpinner2 className={'animate-spin text-blue-500'} size={'5rem'} />
            </div>
          </div>
        ) : (
          <div>
            <div className="ml-auto">
              <Formik
                initialValues={initFormikValue}
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
              >
                {({ values, setFieldValue, errors }) => {
                  return (
                    <Form noValidate={true}>
                      <div className="mb-4">
                        <TextField
                          label={'Name User'}
                          name={'fullname'}
                          type={'text'}
                          placeholder={'Name User'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Username'}
                          name={'username'}
                          type={'text'}
                          placeholder={'Username'}
                          className={'lowercase'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Email'}
                          name={'email'}
                          type={'email'}
                          placeholder={'Email'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Nomor Telepon'}
                          name={'phoneNumber'}
                          type={'text'}
                          placeholder={'Nomor Telepon'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextAreaField
                          label={'Address'}
                          name={'address'}
                          placeholder={'Address'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Tempat Lahir'}
                          name={'birthPlace'}
                          type={'text'}
                          placeholder={'Tempat Lahir'}
                        />
                      </div>
                      <div className="mb-4">
                        <DateField
                          label={'Tanggal Lahir'}
                          name={'birthDt'}
                          type={'date'}
                          handleClear={() => handleClearBirthDt(setFieldValue)}
                        />
                      </div>
                      <div className="mb-4">
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
        )}
      </div>
    </Modal>
  )
}

export default ModalEditUser;