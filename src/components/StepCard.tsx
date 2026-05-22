interface Props {
  step: number
}

function StepCard({ step }: Props) {
  return (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
      STEP {step}
    </div>
  )
}

export default StepCard