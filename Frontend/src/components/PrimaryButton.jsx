import { Link } from "react-router-dom"

function PrimaryButton({ text, to }) {
  return (
    <Link to={to}>
      <button className="primary-btn">
        {text}
      </button>
    </Link>
  )
}

export default PrimaryButton
