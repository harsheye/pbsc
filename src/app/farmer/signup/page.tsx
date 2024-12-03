export default function FarmerSignup() {
  const [otp, setOtp] = useState<string>("");
  const [showOtp, setShowOtp] = useState<boolean>(false);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Your signup logic here
    
    // Instead of sending email, generate OTP and show it
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    setShowOtp(true);
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        {/* Your existing form fields */}
        <button type="submit">Sign Up</button>
      </form>

      {showOtp && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>Your OTP is: <span className="font-bold">{otp}</span></p>
          <p className="text-sm text-gray-600">
            (Email sending is skipped for development)
          </p>
        </div>
      )}
    </div>
  );
} 