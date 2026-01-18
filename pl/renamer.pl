#renamer.pl
# attention REDOS possible ici, les args sont pas secur

use strict;
use warnings;


my $matches = '';

my @files = glob('*');

sub findRename
{
	my $s = $_[0];
	my $r = $_[1];
	
	die "findRename: perl findRename.pl search [replace]" if !defined $s;

		
	foreach my $file (@files)
	{
		next if $file eq 'renamer.pl';
		
		my $newName = $file;

		
		if($file =~ /$s/gi)
		{
				if(defined $r)
				{
					$newName =~ s/$s/$r/i;
					$matches .= "REPLACE: ${ file } with ${ newName} \n";
					rename($file, $newName);
				}
				else
				{
					$matches .= "FOUND: ${ file } \n";
				}
		}
	}

	print $matches;
}

findRename(@ARGV);