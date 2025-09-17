const SIHImpactSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Government Alignment */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Aligned with Government Vision
          </h3>
          <p className="text-lg mb-8 max-w-4xl mx-auto">
            This solution directly addresses the technological challenge posed
            by the Government of Jammu & Kashmir Higher Education Department,
            creating a scalable framework for mental health intervention across
            all higher education institutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">Open Source Solution</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Regional</div>
              <div className="text-lg opacity-90">Language Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Accessibility</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SIHImpactSection;
