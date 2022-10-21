import { MdVerified } from "react-icons/md";

export const VerifiedBadge = () => (
  <span className="verified_icon">
    <MdVerified size={20}/>
    <div className="verified_icon_bg">
      <MdVerified size={20} className=""/>
    </div>
  </span>
)