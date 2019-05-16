import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import styled from 'styled-components';
import FlexMain from '../../../ui/layout/FlexMain';
import HDivider from '../../../ui/HDivider';
import WrRoomDetailInput from './WrRoomDetailInput';

const ConversationBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
`;

const WrRoomDetail = (props: RouteComponentProps<{ roomId: string }>) => {
  // const { match } = props;
  // const { roomId } = match.params;
  return (
    <FlexMain>
      <ConversationBox>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A iaculis at erat pellentesque adipiscing commodo elit at. Senectus et netus et malesuada fames. Sit amet commodo nulla facilisi nullam. Venenatis urna cursus eget nunc scelerisque. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Proin sed libero enim sed faucibus turpis in. Tempus imperdiet nulla malesuada pellentesque elit eget. Blandit volutpat maecenas volutpat blandit aliquam etiam erat. Tortor condimentum lacinia quis vel eros donec ac. Turpis cursus in hac habitasse platea dictumst quisque sagittis. Tortor dignissim convallis aenean et tortor. Arcu bibendum at varius vel pharetra vel turpis. Arcu vitae elementum curabitur vitae nunc.

        Quam vulputate dignissim suspendisse in. Sed odio morbi quis commodo odio aenean sed adipiscing diam. At urna condimentum mattis pellentesque id nibh tortor id. Penatibus et magnis dis parturient montes. Urna molestie at elementum eu facilisis sed odio morbi quis. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit. Ut sem nulla pharetra diam sit amet. Facilisis leo vel fringilla est ullamcorper eget nulla. Id leo in vitae turpis massa sed elementum tempus egestas. Amet tellus cras adipiscing enim eu. Sapien faucibus et molestie ac feugiat sed. Viverra suspendisse potenti nullam ac. Velit laoreet id donec ultrices tincidunt arcu. Cras tincidunt lobortis feugiat vivamus at augue eget arcu. Id porta nibh venenatis cras sed felis. Tellus mauris a diam maecenas sed enim ut sem viverra. Nisl vel pretium lectus quam id. Bibendum arcu vitae elementum curabitur vitae nunc. Diam maecenas sed enim ut sem viverra aliquet eget sit.

        Tortor dignissim convallis aenean et tortor. Sollicitudin aliquam ultrices sagittis orci a scelerisque. Massa sed elementum tempus egestas sed sed. Mi eget mauris pharetra et ultrices neque ornare aenean. Nunc id cursus metus aliquam eleifend. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Integer quis auctor elit sed vulputate mi sit amet. Fringilla ut morbi tincidunt augue interdum velit euismod. Eu non diam phasellus vestibulum lorem. Laoreet suspendisse interdum consectetur libero id. Et odio pellentesque diam volutpat. Gravida arcu ac tortor dignissim. Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu feugiat. Justo eget magna fermentum iaculis eu non diam. Tempus imperdiet nulla malesuada pellentesque elit eget gravida.

        Augue neque gravida in fermentum et sollicitudin ac. Pellentesque id nibh tortor id aliquet lectus proin nibh. Nibh tellus molestie nunc non. Egestas congue quisque egestas diam in arcu cursus euismod. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique. Magna ac placerat vestibulum lectus mauris ultrices eros. Eros donec ac odio tempor orci. Risus quis varius quam quisque. Viverra vitae congue eu consequat. Nulla aliquet porttitor lacus luctus. Non quam lacus suspendisse faucibus interdum posuere lorem. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. A condimentum vitae sapien pellentesque habitant morbi tristique. Neque sodales ut etiam sit amet nisl purus in. Tellus cras adipiscing enim eu turpis. Amet nulla facilisi morbi tempus iaculis urna. Curabitur gravida arcu ac tortor dignissim convallis aenean et.

        Mollis aliquam ut porttitor leo a diam sollicitudin tempor id. Rhoncus mattis rhoncus urna neque viverra justo nec. Porttitor rhoncus dolor purus non enim. Faucibus ornare suspendisse sed nisi lacus sed. Tortor pretium viverra suspendisse potenti. Ornare massa eget egestas purus viverra accumsan in. Odio euismod lacinia at quis risus sed. Gravida in fermentum et sollicitudin ac. Eget mauris pharetra et ultrices neque ornare. Integer feugiat scelerisque varius morbi enim nunc faucibus. Nunc scelerisque viverra mauris in. Amet mauris commodo quis imperdiet. Amet commodo nulla facilisi nullam vehicula. Pulvinar etiam non quam lacus suspendisse faucibus interdum. Porta nibh venenatis cras sed felis eget velit. Pellentesque habitant morbi tristique senectus et netus et. Mi in nulla posuere sollicitudin. Tellus integer feugiat scelerisque varius morbi enim nunc. Sit amet porttitor eget dolor.

        Posuere ac ut consequat semper viverra nam libero justo laoreet. Dolor purus non enim praesent elementum facilisis leo vel fringilla. Netus et malesuada fames ac turpis egestas maecenas pharetra. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Diam vel quam elementum pulvinar etiam non quam lacus. Diam donec adipiscing tristique risus nec feugiat in fermentum. Dignissim cras tincidunt lobortis feugiat vivamus at augue. Viverra aliquet eget sit amet tellus cras adipiscing. Est velit egestas dui id ornare. Volutpat consequat mauris nunc congue nisi vitae suscipit tellus mauris. Mattis rhoncus urna neque viverra justo nec. Id faucibus nisl tincidunt eget nullam non nisi est sit. Et sollicitudin ac orci phasellus egestas tellus rutrum tellus. At quis risus sed vulputate odio ut.

        Sagittis nisl rhoncus mattis rhoncus urna neque viverra. Morbi blandit cursus risus at ultrices mi tempus imperdiet nulla. Aliquam sem et tortor consequat id porta nibh venenatis. Gravida cum sociis natoque penatibus et magnis dis parturient. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Iaculis nunc sed augue lacus viverra vitae. Habitant morbi tristique senectus et. In vitae turpis massa sed elementum tempus. Dictum varius duis at consectetur lorem donec. Viverra mauris in aliquam sem fringilla ut morbi tincidunt.

        Tincidunt augue interdum velit euismod in. Tempor orci eu lobortis elementum nibh tellus molestie. Morbi tempus iaculis urna id volutpat lacus laoreet non. Tortor aliquam nulla facilisi cras fermentum. Integer enim neque volutpat ac tincidunt vitae semper quis. Eu scelerisque felis imperdiet proin. Arcu cursus euismod quis viverra nibh cras. Id neque aliquam vestibulum morbi blandit cursus risus at ultrices. Elementum curabitur vitae nunc sed velit. Gravida arcu ac tortor dignissim convallis aenean et. Nibh ipsum consequat nisl vel pretium lectus quam id leo. Diam sit amet nisl suscipit adipiscing. Ut enim blandit volutpat maecenas volutpat blandit aliquam etiam. Viverra mauris in aliquam sem fringilla ut. Sed lectus vestibulum mattis ullamcorper.

        Arcu odio ut sem nulla pharetra diam sit. Laoreet suspendisse interdum consectetur libero id. Vel elit scelerisque mauris pellentesque pulvinar. Non odio euismod lacinia at quis. Adipiscing elit pellentesque habitant morbi tristique senectus et. Vel pretium lectus quam id. Eget magna fermentum iaculis eu non diam phasellus. Mattis molestie a iaculis at. Fringilla urna porttitor rhoncus dolor purus non enim. Tincidunt ornare massa eget egestas purus viverra accumsan in nisl. Vitae sapien pellentesque habitant morbi tristique. In cursus turpis massa tincidunt dui. Sagittis eu volutpat odio facilisis mauris sit.

        Pretium fusce id velit ut. Odio euismod lacinia at quis risus sed vulputate. Ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. At ultrices mi tempus imperdiet nulla malesuada. In aliquam sem fringilla ut morbi tincidunt. Rhoncus aenean vel elit scelerisque. Vulputate odio ut enim blandit volutpat maecenas. Urna duis convallis convallis tellus id interdum velit laoreet id. Felis imperdiet proin fermentum leo vel orci porta. Id donec ultrices tincidunt arcu.
      </ConversationBox>
      <HDivider />
      <WrRoomDetailInput />
    </FlexMain>
  );
};

export default withRouter(WrRoomDetail);
