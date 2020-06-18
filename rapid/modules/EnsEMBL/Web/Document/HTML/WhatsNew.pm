=head1 LICENSE

Copyright [1999-2015] Wellcome Trust Sanger Institute and the EMBL-European Bioinformatics Institute
Copyright [2016-2018] EMBL-European Bioinformatics Institute

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

=cut

package EnsEMBL::Web::Document::HTML::WhatsNew;

### This module uses our blog's RSS feed to create a list of headlines
### Note that the RSS XML is cached to avoid saturating our blog's bandwidth! 

use strict;

use base qw(EnsEMBL::Web::Document::HTML);

sub render {
  my $self  = shift;

  my $html = qq(<h2 class="box-header">Latest Genomes</h2>
<ul>);

  ## TODO - replace this with list from metadata db
  my $info = $self->hub->get_species_info;

  foreach my $species (sort {$info->{$a}{'scientific'} cmp $info->{$b}{'scientific'}} keys %$info) {
    $html .= sprintf '<li><a href="/%s/">%s</a> (%s)</li>', 
                $species, 
                $info->{$species}{'scientific'},
                $info->{$species}{'common'};
  }

  $html .= '</ul>';

  return $html;
}

1;