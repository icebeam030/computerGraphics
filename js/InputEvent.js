function initMyInput()
{
   var onKeyDown = function ( event ) {
   switch ( event.keyCode ) {

   case 87: // w
       moveForward = true;
       break;

   case 65: // a
       moveLeft = true;
       break;

   case 83: // s
       moveBackward = true;
       break;

   case 68: // d
       moveRight = true;
       break;
   }

   };

   var onKeyUp = function ( event ) {
   switch( event.keyCode ) {

   case 87: // w
       moveForward = false;
       break;

   case 65: // a
       moveLeft = false;
       break;

   case 83: // s
       moveBackward = false;
       break;

   case 68: // d
       moveRight = false;
       break;
   }
   };

   document.addEventListener( 'keydown', onKeyDown, false );
   document.addEventListener( 'keyup', onKeyUp, false );
}