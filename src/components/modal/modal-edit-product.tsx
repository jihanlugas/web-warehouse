import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { UpdateProduct } from "@/types/product";
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


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
});

const defaultInitFormikValue: UpdateProduct = {
  name: '',
  description: '',
}

const ModalEditProduct: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState<UpdateProduct>(defaultInitFormikValue)

  const preloads = ''
  const { data, isLoading } = useQuery({
    queryKey: ['product', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/product/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['product', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/product/' + selectedId, val),
  });


  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          name: data.payload.name,
          description: data.payload.description,
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

  const handleSubmit = async (values: UpdateProduct, formikHelpers: FormikHelpers<UpdateProduct>) => {
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          onClickOverlay('', true)
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
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Product</div>
          <button type="button" onClick={() => onClickOverlay('', true)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4 border-gray-200" />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="py-20">
              <ImSpinner2 className={'animate-spin'} size={'5rem'} />
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
                {({ }) => {
                  return (
                    <Form noValidate={true}>
                      <div className="mb-4">
                        <TextField
                          label={'Product Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Product Name'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextAreaField
                          label={'Description'}
                          name={'description'}
                          placeholder={'Description'}
                        />
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Simpan'}
                          disabled={isPending}
                          loading={isPending}
                        />
                      </div>
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

export default ModalEditProduct;