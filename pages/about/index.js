export default function About() {
  return (
    <>
      <div className="mt-52 text-center font-bold fade-group">
        <h2 className="md:text-6xl text-5xl">いちワクとは</h2>
        <p className="mt-5 italic">What is ICHIWAK ?</p>
      </div>
      <div className="text-center mt-36 sm:text-xl text-ls max-w-7xl m-auto fade-group">
        <p className=" leading-[40px]">
          いちワクとは
          <br className="sm:hidden block" />
          市原市の企業の
          <br className="sm:block hidden" />
          労働者不足を解決するための
          <br className="sm:hidden block" />
          市原市特化型求人サイトです。
        </p>
      </div>
      <div className="flex max-w-7xl w-[90%] mx-auto my-24 flex-wrap">
        <div className="text-center sm:leading-[60px] leading-[40px] xl:w-1/2 w-full mx-auto fade-group">
          <h3 className="text-green-500 text-center text-xl mb-5">Misson</h3>
          <div>
            市原の中小企業の労働者不足の解決市原市の事業社数はおよそ10,000社です。
            <br className="sm:block hidden" />
            その多くは中小企業が占めています。昨今問題になっている後継者の不在、
            <br className="sm:block hidden" />
            労働者不足により事業の成長はもとより維持するのも難しい環境になっています。
            <br className="sm:block hidden" />
            従来の求人方法のハローワークだよりでは、本当に来て欲しい人材に訴求できず、
            <br className="sm:block hidden" />
            また大手広告代理店に月２０万円近い金額を出して、
            <br className="sm:block hidden" />
            募集するのも中小零細企業が多い市原市では難しいと考えています。
          </div>
        </div>
        <div className="text-center sm:leading-[60px] leading-[40px] xl:w-1/2 w-full mx-auto fade-group xl:mt-0 mt-20">
          <h3 className="text-green-500 text-center text-xl mb-5">Value</h3>
          <div>
            市原の中小企業を採用から底上げしていく。
            <br className="sm:block hidden" />
            いちワクプロジェクトでは、企業の費用負担を可能な限り抑えて、
            <br className="sm:block hidden" />
            企業が求める人材にアプローチする求人サイトを制作致します。
            <br className="sm:block hidden" />
            地元市原で働いている人をターゲットにするだけではなく、
            <br className="sm:block hidden" />
            市外・県外への人達に市原市に来てもらい働いてもらう、
            <br className="sm:block hidden" />
            できれば市原市に住んで、そこに根付いてもらい
            <br className="sm:block hidden" />
            地域の活性化にも寄与できればと考えています。
          </div>
        </div>
      </div>
    </>
  );
}
