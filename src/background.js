


function bg() {
    const background = {
        width:'100vw',
        height:'100vh',
        backgroundImage:'url(gif here)',
        backgroundSize:'cover',
        backgroundPosition:'center',
        backgroundRepeat:'no-repeat'
    };
    return ( <div> style={background}
        <h1>Hello World</h1>

        </div>
    );
}

export default bg;