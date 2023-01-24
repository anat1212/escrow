export default function EscrowNew({ address, arbiter, beneficiary, value }) {
  return (
    <div className="existing-contract">
      <h1> Contract For Approval </h1>
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div id="arbiterSaved"> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
      </ul>
    </div>
  );
}
