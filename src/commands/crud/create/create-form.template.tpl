import { SubmitHandler, useForm } from 'react-hook-form';

interface Create{{upperEntity}}FormData {
  example: string;
  exampleRequired: string;
}

interface Create{{upperEntity}}FormProps {
  children?: React.ReactNode;
  onSubmit: SubmitHandler<Create{{upperEntity}}FormData>;
}

export const Create{{upperEntity}}Form = ({
  onSubmit,
}: Create{{upperEntity}}FormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Create{{upperEntity}}FormData>();

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="mb-4">
        <label htmlFor="example" className="block">
          Example
        </label>
        {/* register your input into the hook by invoking the "register" function */}
        <input
          id="example"
          className="px-4 py-2 rounded-lg"
          defaultValue="test"
          {...register('example')}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="exampleRequired" className="block">
          Required example
        </label>
        {/* include validation with required or other standard HTML validation rules */}
        <input
          id="exampleRequired"
          className="px-4 py-2 rounded-lg"
          {...register('exampleRequired', { required: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.exampleRequired && (
          <span className="block my-2 text-red-500">
            This field is required
          </span>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-slate-700 text-slate-50"
      >
        Submit
      </button>
    </form>
  );
};
